const express = require('express')
const {getAllOwnedReservation,getAllSupervisedReservation,updateReservationState,
    createReservation,getReservationById,saveReservationComment, getAllReservation,getCancelReservationForm,
    upcomingReservations,latestReservations,sendSurvey,getSurveyForm,isOwner,cancelReservation,
    updateReservation,reservationStatus,selectedReservationRole,sendForCorrections,changeReservationSettings}
     = require('../Controllers/ReservationController')
const { verifyAccessToken } = require('../Middlewares/tokenVerify')
const rentalRouter = express.Router();
rentalRouter.get('/owned/:id',verifyAccessToken,isOwner);
rentalRouter.get('/owned',verifyAccessToken,getAllOwnedReservation);
rentalRouter.get('/supervised',verifyAccessToken,getAllSupervisedReservation);
rentalRouter.get('/upcoming',upcomingReservations)
rentalRouter.post('/:id/survey',verifyAccessToken,sendSurvey);
rentalRouter.get('/:id/survey',verifyAccessToken,getSurveyForm);


rentalRouter.get('/:id/decline',verifyAccessToken,getCancelReservationForm);
rentalRouter.get('/latest',latestReservations)
rentalRouter.get('/state/:id',verifyAccessToken,reservationStatus);
rentalRouter.post('/state/:id/comment',verifyAccessToken,saveReservationComment);
rentalRouter.get('/state/:id/role',verifyAccessToken,selectedReservationRole)
rentalRouter.post('/state/:id/settings',verifyAccessToken,changeReservationSettings)
rentalRouter.post('/')

rentalRouter.get('/:id',verifyAccessToken,getReservationById);
rentalRouter.post('/',verifyAccessToken,createReservation);
rentalRouter.delete('/:id',verifyAccessToken,cancelReservation);
rentalRouter.put('/:id',verifyAccessToken,updateReservation);
rentalRouter.get('/',verifyAccessToken,getAllReservation)
rentalRouter.post('/supervised/:id',verifyAccessToken,updateReservationState)

module.exports = rentalRouter;
