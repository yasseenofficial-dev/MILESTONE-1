# Event Management Platform

## Project Description
This project is a full-stack Event Management Platform developed for CSEN B503 Milestone 2.  
My implemented section focuses on the Guest User Journey, specifically points 17 to 21.

## Implemented Guest User Journeys

### 17. Invitation Receipt
Guests can view the event invitation details, including:
- Event name
- Date
- Time
- Venue
- Dress code
- Agenda

### 18. RSVP
Guests can submit an RSVP response by selecting:
- Attending
- Not Attending
- Maybe

Guests can also enter:
- Dietary preferences
- Special requirements

### 19. Day-Of Communications
Guests can view live event messages sent by the organizer.  
Each message includes a status such as:
- Seen
- Received
- Follow-up Sent

### 20. Event Check-In
Guests can view their name and QR code, then confirm check-in.  
The system stores the check-in record in the database file.

### 21. Post-Event Feedback
Guests can submit feedback about:
- Overall experience
- Food and beverages
- Venue
- Organization
- Open comments

The system displays a thank-you message after successful submission.

## Technologies Used
- React
- React Router
- Axios
- Node.js
- Express.js
- CORS
- JSON file database
- GitHub

## Project Structure

```text
MILESTONE-1/
├── Backend/
│   ├── database/
│   │   └── db.json
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── pages/
│   │       ├── GuestInvitation.jsx
│   │       ├── GuestRSVP.jsx
│   │       ├── GuestMessages.jsx
│   │       ├── GuestCheckIn.jsx
│   │       └── GuestFeedback.jsx
│   ├── package.json
│   └── package-lock.json
│
└── README.md