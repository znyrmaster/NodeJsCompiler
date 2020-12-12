const express = require("express");
let { PythonShell } = require("python-shell");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");
const { exec } = require("child_process");
var shell = require("shelljs");
const app = express();

app.use(cors());
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  console.log(req.body.name);


  try {
    fs.mkdir(`${req.body.id}`, (err, folder) => {
      if (err) console.log(err);
      else {
        console.log("The temporary folder path is:", folder);
        if (req.body.name == "python") {
          fs.writeFile(`${req.body.id}/run.py`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          PythonShell.run(`${req.body.id}/run.py`, null, function (err, results) {
            if (err) {
              res.send(err.message);
              console.log(err.messag);
            }
            console.log(results);
            res.send(results);
          });
        } else if (req.body.name == "javascript") {
          //   eval(req.body.code).then((val) =>
          //     console.log("asynchronous logging has val:", val)
          //   );
    
          await fs.writeFile(`${req.body.id}/run.js`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
            exec(`node ${req.body.id}/run.js`, function (err, stdout, stderr) {
              // handle err, stdout, stderr
              if (err) {
                // console.error(`exec error 0000000: ${error}`);
                // console.error(error.name);
                // console.error(stderr);
                res.send(stderr);
              }
              res.send(stdout);
    
              console.log(stdout);
            });
          });
          //   if (shell.exec("run.js").code !== 0) {
          //     shell.echo("Error: Git commit failed");
          //     shell.exit(1);
          //   }
          //   await exec("node run.js", function (err, stdout, stderr) {
          //     // handle err, stdout, stderr
          //     if (error) {
          //       // console.error(`exec error 0000000: ${error}`);
          //       console.error(error.name);
          //       console.error(stderr);
          //       res.send(stderr);
          //     }
          //     res.send(stdout);
    
          //     console.log(stdout);
          //   });
        } else if (req.body.name == "c") {
          fs.writeFile(`${req.body.id}/run.c`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(`gcc ${req.body.id}/run.c -o run`, (error, stdout, stderr) => {
            if (error) {
              // console.error(`exec error 0000000: ${error}`);
              // console.error(error.name);
              // console.error(stderr);
              res.send(stderr);
            } else {
              exec(`${req.body.id}/run`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                  console.error(`exec error: ${error}`);
                  res.send(error);
    
                  return;
                }
                res.send(stdout);
              });
            }
          });
        } else if (req.body.name == "c++") {
          fs.writeFile(`${req.body.id}/run.cpp`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
    
          exec(`g++ ${req.body.id}/run.cpp -o teste`, (error, stdout, stderr) => {
            if (error) {
              // console.error(`exec error 0000000: ${error}`);
              // console.error(error.name);
              // console.error(stderr);
              res.send(stderr);
            } else {
              exec(`${req.body.id}/teste`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                  console.error(`exec error: ${error}`);
                  res.send(error);
    
                  return;
                }
                res.send(stdout);
              });
            }
          });
        } else if (req.body.name == "java") {
          fs.writeFile(`${req.body.id}/run.java`, req.body.code, function (err) {
            if (err) throw err;
            console.log("Saved!");
          });
          exec(`javac ${req.body.id}/run.java`, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error 0000000: ${error}`);
              console.error(error.name);
              console.error(stderr);
              res.send(stderr);
            } else {
              exec(`cd ${req.body.id} && java run`, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                  console.error(`exec error: ${error}`);
                  res.send(error);
    
                  return;
                }
                res.send(stdout);
              });
            }
          });
        }
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
      }
    });


    
  } catch (error) { }
});

app.listen(3340, () => {
  console.log("started");
});
