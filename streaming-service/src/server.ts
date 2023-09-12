import net from 'net';
import { WebSocket, WebSocketServer } from 'ws';
import * as fs from 'fs';

const TCP_PORT = parseInt(process.env.TCP_PORT || '12000', 10);

const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: 8080 });
const invalid: number[] = [];

tcpServer.on('connection', (socket) => {
    console.log('TCP client connected');
    
    socket.on('data', (msg) => {
        console.log(msg.toString());

        // HINT: what happens if the JSON in the received message is formatted incorrectly?
        // HINT: see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
        try {
            let currJSON = JSON.parse(msg.toString());
        } catch (error) {
            console.error(error);
        }

        try {
            var tmp = JSON.parse("[" + msg.toString() + "]");
            let tmp_temp = tmp[0].battery_temperature;
            let tmp_time = tmp[0].timestamp;
            console.log(tmp_temp);
            console.log(tmp_time);
            if (tmp_temp > 80 || tmp_temp < 20) {
                invalid.push(tmp_time);
            }
            if (invalid.length >= 3) {
                const diff: number = invalid[2] - invalid[0];
                console.log(diff)
                if (diff <= 5000) {
                    console.log("wrong temps in 5 sec");
                  
                    fs.appendFile("incidents.log", `${tmp_time.toString()}\n`, (err) => {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          console.log("\nFile Contents of file after append:",
                            fs.readFileSync("incidents.log", "utf8"));
                        }
                      });
                }
                invalid.length = 0;
            }
            console.log(invalid)
        } catch (error) {
            console.error(error);
        }


        websocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(msg.toString());
            }
          });
    });

    socket.on('end', () => {
        console.log('Closing connection with the TCP client');
    });
    
    socket.on('error', (err) => {
        console.log('TCP client error: ', err);
    });
});

websocketServer.on('listening', () => console.log('Websocket server started'));

websocketServer.on('connection', async (ws: WebSocket) => {
    console.log('Frontend websocket client connected to websocket server');
    ws.on('error', console.error);  
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});


