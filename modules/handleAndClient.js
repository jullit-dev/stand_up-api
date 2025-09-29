import { sendError } from './send.js';
import fs from "node:fs/promises";

export const handleAndClient = (req, res) => {
  let body = '';
  try {
    req.on('data', chunk => {
      body += chunk;
    });
  } catch (error) {
    console.log("Ошибка при чтении запроса");
    send.Error(res, 500, "Ошибка сервера при чтении запроса");
  }
  req.on("end", async () => {
    try {
      const newClient = JSON.parse(body);

      if (
        !newClient.fullName ||
        !newClient.phone ||
        !newClient.ticketNumber
      ) {
        sendError(res, 400, "Неверные основные данные клиента");
        return;
      }

      if (
        newClient.booking &&
        (!Array.isArray(newClient.booking) ||
        !newClient.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, "Неверно зполнены поля бронирования");
        return;
      }

      const clientData = await fs.readFile(CLIENTS, 'utf-8');
      const clients = JSON.parse(clientData);

      clients.push(newClient);

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, newClient);
    } catch (error) {
      console.log('error: ', error);
    }
  
  })
};