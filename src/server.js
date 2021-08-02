const express = require("express");
let { PythonShell } = require("python-shell");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
const { exec } = require("child_process");
var shell = require("shelljs");
const app = express();



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

  try {
    fs.mkdir(`${req.body.id}`, (err, folder) => {
      if (err) {
        console.log(err);
      } else {
        if (req.body.name == "python") {

          console.log(req.body.code)

          let abc = req.body.code

          // new code
          let indices;
          var count;
          var pcount;

          if (abc.includes("matplotlib")) {
            function countOccurences(string, word) {
              return string.split(word).length - 1;
            }
            count = countOccurences(abc, ".show()"); // 2



            for (let i = 0; i < count; i++) {
              abc = abc.replace(".show()", `.savefig('/media/ZNYR/NodeJsCompiler/public/Images/${req.body.id}-${i}.png')`)
              // abc = abc.replace(".show()", `.savefig('public/Images/abc-${i}.png')`)
            }
            console.log(count)
            console.log(abc)


          } else {
            console.log("nothing")
          }

          // if (abc.includes("plotly")) {
          //   function countOccurences(string, word) {
          //     return string.split(word).length - 1;
          //   }
          //   pcount = countOccurences(abc, ".show()"); // 2



          //   for (let i = 0; i < pcount; i++) {
          //     abc = abc.replace(".show()", `.to_dict()\nprint(fig.to_dict())\n`)
          //     // abc = abc.replace(".show()", `.savefig('public/Images/abc-${i}.png')`)
          //   }
          //   console.log(pcount)
          //   console.log(abc)


          // } else {
          //   console.log("nothing")
          // }








          // new code

          console.log("abc", abc)
          fs.writeFile(`${req.body.id}/run.py`, abc, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(`python3 ${req.body.id}/run.py`, function (error, stdout, stderr) {
            // handle err, stdout, stderr
            console.log("opp", error, stdout, stderr)
            if (error) {
              console.error(`exec error 0000000: ${error}`);
              console.error(error.name);
              console.error(stderr);
              fs.rmdir(
                `${req.body.id}`,
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
              res.send(stderr);
            } else {
              fs.rmdir(
                `${req.body.id}`,
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

              if (count > 0) {
                console.log("matplotlib")
                // res.sendFile("NodeJsCompiler/pavitest2@gmail.com/0.png");
                // let abc = {"type":"image",img:[]}
                let img = []
                for (let i = 0; i < count; i++) {

                  img.push(`Images/${req.body.id}-${i}.png`)
                }
                res.send(img)

              }
              // else if(pcount > 0) {
              //   console.log("plotly")

              //   let out = {
              //     type:'plotly',
              //     data :stdout
              //   }
              //   res.json(stdout);

              // }
              else {
                console.log("nothing")

                res.send(stdout);

              }

              console.log(stdout);
              console.log(typeof stdout);
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

          fs.writeFile(`${req.body.id}/run.js`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
            exec(`node ${req.body.id}/run.js`, function (err, stdout, stderr) {
              // handle err, stdout, stderr
              if (err) {
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${req.body.id}`,
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
                res.send(stderr);
              } else {
                fs.rmdir(
                  `${req.body.id}`,
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
          fs.writeFile(`${req.body.id}/run.c`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(
            `cd ${req.body.id} && gcc run.c -o run`,
            (error, stdout, stderr) => {
              if (error) {
                console.log("error");
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${req.body.id}`,
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
                res.send(stderr);
              } else {
                console.log("1");

                exec(`cd ${req.body.id} && ./run`, (error, stdout, stderr) => {
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
                  if (error) {
                    console.log("2");

                    console.error(`exec error: ${error}`);
                    fs.rmdir(
                      `${req.body.id}`,
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
                      `${req.body.id}`,
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
            }
          );
        } else if (req.body.name == "c++") {
          fs.writeFile(`${req.body.id}/run.cpp`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });

          exec(
            `cd ${req.body.id} && g++ run.cpp -o teste`,
            (error, stdout, stderr) => {
              if (error) {
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                fs.rmdir(
                  `${req.body.id}`,
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
                res.send(stderr);
              } else {
                exec(
                  `cd ${req.body.id} && ./teste`,
                  (error, stdout, stderr) => {
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    if (error) {
                      console.error(`exec error: ${error}`);
                      fs.rmdir(
                        `${req.body.id}`,
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
                        `${req.body.id}`,
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
            `${req.body.id}/run.java`,
            req.body.code,
            function (err) {
              if (err) throw err;
              console.log("Saved!");
            }
          );
          exec(`javac ${req.body.id}/run.java`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error 0000000: ${error}`);
              console.error(error.name);
              console.error(stderr);
              fs.rmdir(
                `${req.body.id}`,
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
              res.send(stderr);
            } else {
              exec(`cd ${req.body.id} && java run`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                  console.error(`exec error: ${error}`);
                  fs.rmdir(
                    `${req.body.id}`,
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
                    `${req.body.id}`,
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

// app.listen(3334, () => {
//   console.log("started");
// });


app.listen(3331, () => {
  console.log("started");
});
