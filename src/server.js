const express = require("express");
let { PythonShell } = require("python-shell");
var cors = require("cors");
const fs = require("fs");

var bodyParser = require("body-parser");
const { exec } = require("child_process");
var shell = require("shelljs");
const app = express();



app.use(cors())

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/Images'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  console.log(req.body.name);
  console.log(`${__dirname}` + "/" + `${req.body.id}`)

  try {
    fs.mkdir(`${__dirname}` + "/" + `${req.body.id}`, (err, folder) => {
      if (err) {
        console.log(err);
      } else {
        if (req.body.name == "python") {

          console.log(req.body.code)

          let abc = req.body.code

         
          console.log("abc", abc)
          console.log("folder path", __dirname)
          fs.writeFile(`${__dirname}` + "/" + `${req.body.id}/run.py`, abc, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(`python3 ${__dirname}` + "/" + `${req.body.id}/run.py`, function (error, stdout, stderr) {
            // handle err, stdout, stderr
            console.log("opp", error, stdout, stderr)
            if (error) {
              console.error(`exec error 0000000: ${error}`);
              console.error(error.name);
              console.error(stderr);
              fs.rmdir(
                `${__dirname}` + "/" + `${req.body.id}`,
                {
                  recursive: true,
                },
                (error) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Non Recursive: Directories Deleted!");
                  }
                }
              );
              res.json({"error":"error","output":stderr});
            } else {
              fs.rmdir(
                `${__dirname}` + "/" + `${req.body.id}`,
                {
                  recursive: true,
                },
                (error) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Non Recursive: Directories Deleted!");
                  }
                }
              );
              console.log("else", stdout)
              console.log("else",typeof stdout)


                res.send(stdout);

           
            }
          });
          // PythonShell.run(
          //   `${req.body.id}/run.py`,
          //   null,
          //   function (err, results) {
          //     if (err) {
          //       console.log(req.body.id);
          //       // fs.rmdir(
          //       //   `${req.body.id}`,
          //       //   {
          //       //     recursive: true,
          //       //   },
          //       //   (error) => {
          //       //     if (error) {
          //       //       console.log(error);
          //       //     } else {
          //       //       console.log("Non Recursive: Directories Deleted!");
          //       //     }
          //       //   }
          //       // );
          //       res.send(err.message);
          //       // console.log(err.message);
          //     } else {
          //       console.log(req.body.id);

          //       console.log(results);
          //       console.log("working");
          //       // fs.rmdir(
          //       //   `${req.body.id}`,
          //       //   {
          //       //     recursive: true,
          //       //   },
          //       //   (error) => {
          //       //     if (error) {
          //       //       console.log(error);
          //       //     } else {
          //       //       console.log("Non Recursive: Directories Deleted!");
          //       //     }
          //       //   }
          //       // );
          //       res.send(results);
          //     }
          //   }
          // );
        } else if (req.body.name == "javascript") {
          //   eval(req.body.code).then((val) =>
          //     console.log("asynchronous logging has val:", val)
          //   );

          fs.writeFile(`${__dirname}` + "/" + `${req.body.id}/run.js`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
            exec(`node ${__dirname}` + "/" + `${req.body.id}/run.js`, function (err, stdout, stderr) {
              // handle err, stdout, stderr
              if (err) {
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${__dirname}` + "/" + `${req.body.id}`,
                  {
                    recursive: true,
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Non Recursive: Directories Deleted!");
                    }
                  }
                );
                // res.send(stderr);
              res.json({"error":"error","output":stderr});

              } else {
                fs.rmdir(
                  `${__dirname}` + "/" + `${req.body.id}`,
                  {
                    recursive: true,
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Non Recursive: Directories Deleted!");
                    }
                  }
                );
                res.send(stdout);

                console.log(stdout);
              }
            });
          });
        } else if (req.body.name == "c") {
          fs.writeFile(`${__dirname}` + "/" + `${req.body.id}/run.c`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(
            `cd ${__dirname}` + "/" + `${req.body.id} && gcc run.c -o run`,
            (error, stdout, stderr) => {
              if (error) {
                console.log("error");
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${__dirname}` + "/" + `${req.body.id}`,
                  {
                    recursive: true,
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Non Recursive: Directories Deleted!");
                    }
                  }
                );
                // res.send(stderr);
              res.json({"error":"error","output":stderr});

              } else {
                console.log("1");

                exec(`cd ${__dirname}` + "/" + `${req.body.id} && ./run`, (error, stdout, stderr) => {
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
                  if (error) {
                    console.log("2");

                    console.error(`exec error: ${error}`);
                    fs.rmdir(
                      `${__dirname}` + "/" + `${req.body.id}`,
                      {
                        recursive: true,
                      },
                      (error) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Non Recursive: Directories Deleted!");
                        }
                      }
                    );
                    res.send(error);

                    return;
                  } else {
                    console.log("2");

                    fs.rmdir(
                      `${__dirname}` + "/" + `${req.body.id}`,
                      {
                        recursive: true,
                      },
                      (error) => {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Non Recursive: Directories Deleted!");
                        }
                      }
                    );
                    console.log("ccccstdout",stdout)
                    console.log("ccccstdout-type",typeof stdout)
                    res.send(stdout);
                  }
                });
              }
            }
          );
        } else if (req.body.name == "c++") {
          fs.writeFile(`${__dirname}` + "/" + `${req.body.id}/run.cpp`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });

          exec(
            `cd ${__dirname}` + "/" + `${req.body.id} && g++ run.cpp -o teste`,
            (error, stdout, stderr) => {
              if (error) {
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${__dirname}` + "/" + `${req.body.id}`,
                  {
                    recursive: true,
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Non Recursive: Directories Deleted!");
                    }
                  }
                );
                // res.send(stderr);
              res.json({"error":"error","output":stderr});

              } else {
                exec(
                  `cd ${__dirname}` + "/" + `${req.body.id} && ./teste`,
                  (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (error) {
                      console.error(`exec error: ${error}`);
                      fs.rmdir(
                        `${__dirname}` + "/" + `${req.body.id}`,
                        {
                          recursive: true,
                        },
                        (error) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Non Recursive: Directories Deleted!");
                          }
                        }
                      );
                      res.send(error);

                      return;
                    } else {
                      fs.rmdir(
                        `${__dirname}` + "/" + `${req.body.id}`,
                        {
                          recursive: true,
                        },
                        (error) => {
                          if (error) {
                            console.log(error);
                          } else {
                            console.log("Non Recursive: Directories Deleted!");
                          }
                        }
                      );
                      res.send(stdout);
                    }
                  }
                );
              }
            }
          );
        } else if (req.body.name == "java") {
          fs.writeFile(
            `${__dirname}` + "/" + `${req.body.id}/run.java`,
            req.body.code,
            function (err) {
              if (err) throw err;
              console.log("Saved!");
            }
          );
          exec(`javac ${__dirname}` + "/" + `${req.body.id}/run.java`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error 0000000: ${error}`);
              console.error(error.name);
              console.error(stderr);
              fs.rmdir(
                `${__dirname}` + "/" + `${req.body.id}`,
                {
                  recursive: true,
                },
                (error) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Non Recursive: Directories Deleted!");
                  }
                }
              );
              // res.send(stderr);
              res.json({"error":"error","output":stderr});

            } else {
              exec(`cd ${__dirname}` + "/" + `${req.body.id} && java run`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                  console.error(`exec error: ${error}`);
                  fs.rmdir(
                    `${__dirname}` + "/" + `${req.body.id}`,
                    {
                      recursive: true,
                    },
                    (error) => {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("Non Recursive: Directories Deleted!");
                      }
                    }
                  );
                  res.send(error);

                  return;
                } else {
                  fs.rmdir(
                    `${__dirname}` + "/" + `${req.body.id}`,
                    {
                      recursive: true,
                    },
                    (error) => {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("Non Recursive: Directories Deleted!");
                      }
                    }
                  );
                  res.send(stdout);
                }
              });
            }
          });
        }
      }
    });
  } catch (error) { }
});

app.listen(3334, () => {
  console.log("started");
});


// app.listen(8282, () => {
//   console.log("started");
// });
