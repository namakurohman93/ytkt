# ytkt
Your Travian: Kingdom Tool. This project is inspired by the [Travian Kingdom Tool](https://travian.engin9tools.com/).

The idea is, instead using [official API](https://forum.kingdoms.com/index.php?thread/4099-api-for-external-tools/) data from Travian: Kingdom that **updated once a day**, `ytkt` using your session to get map data so you can get **updated data every hour** without waiting for the official one.

## Installation
Make sure you already install [node js](https://nodejs.org/en/download/) and clone this repo.

```sh
npm run install-all
npm run build
npm start
```

Open your browser then access `localhost:3000`

To custom port, use `EXPORT PORT=<desired port>`.  
Example
```sh
EXPORT PORT=80
npm start
```

## Development
```sh
npm run dev
```

### Front-end
For those who want to develop `front-end`, access `localhost:8000` and make change on `client` folder.  
The `client` it self using [react js](https://reactjs.org/)

### Back-end
For those who want to develop `back-end`, access `localhost:3000/api/` and make change on `ytkt` directory.  
The `back-end` it self using [express js](http://expressjs.com/)
