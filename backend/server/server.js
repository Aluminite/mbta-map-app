const compression = require("compression");
const express = require("express");
const app = express();
const cors = require('cors');
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const dbConnection = require('./config/db.config');
const editUser = require('./routes/userEditUser');
const userInfo = require('./routes/userInfo');
const getFavoriteByIdRoute = require('./routes/favoriteReadFavorite');
const deleteFavorite = require('./routes/favoriteDelete');
const createNewFavorite = require('./routes/favoriteCreateNew');
const mbtaRoutes = require('./routes/routesApi');
const vehicleRoutes = require('./routes/vehicleApi');
const tripsApi = require('./routes/tripApi');
const tripShapesApi = require('./routes/tripShapeApi');
const stopsApi = require('./routes/stopsApi');
const predictionsApi = require('./routes/predictionsApi');
const alertsApi = require('./routes/alertsApi');

app.use(compression());

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', editUser);
app.use('/user', userInfo);
app.use('/favorites', getFavoriteByIdRoute);
app.use('/favorites', deleteFavorite);
app.use('/favorites', createNewFavorite);
app.use('/api', mbtaRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', tripsApi);
app.use('/api', tripShapesApi);
app.use('/api', stopsApi);
app.use('/api', predictionsApi);
app.use('/api', alertsApi);

app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
