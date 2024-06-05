# LittleLives Role Challenge
Develop a simplified appointment system. Develop a RESTful API for an endpoint scheduling system that supports creating, viewing and cancelling appointments, with configurable slots and operational parameters

Documentation for the task requirements can be found [here](https://docs.google.com/document/d/1fdzbEFDwJGPjBx_hQTvwRKe-KcO8vbr2Pqeau5n3PnA/edit)

> [!CAUTION]
> I have added a new eraser.io diagram and markdown explanation separately available [here](https://app.eraser.io/workspace/X3g7EWHnO6TTR1Qv9Pq5?origin=share). Please feel free to read through it to understand my thought process.

## API Diagram
API Diagram produced using [eraser.io](https://eraser.io). But do please head over to the [eraser.io diagram](https://app.eraser.io/workspace/X3g7EWHnO6TTR1Qv9Pq5?origin=share) for more detailed information.

![API Diagram Image](https://raw.githubusercontent.com/kyapwc/littlelives/master/.assets/eraser_diagram.png)

<a id="note"></a>
## Note:
I started the project in Javascript and by the time I finished it at 7:20PM (I chose 3:30pm start time and 4 hour timeslot = 7:30pm and wanted to take this time to document the project instead of converting to typescript), I did not have time to convert the project to typescript which is a huge oversight. Apologies on this as I did not read the `Language` specified in the requirements (which is deeply regretable).

> [!CAUTION]
> Have managed to convert the project to typescript (took around 1 and a half hours), can disregard above.
> However, only converted the project to typescript after 8:30pm due to going out for dinner. Please check commit history to see when the project was finished.

Database used is `postgresql`, the reason for this is mostly due to my familiarity of using postgres as opposed to MongoDB / mysql as I've been using Postgresql for more than 5 years and mysql is 3 years and MongoDB is at 2 years. Furthermore, the reason for a sql database as opposed to a noSQL database is due to the structure of the data having to be quite defined and not suited for a noSQL database.

Database design is as shown in this [dbdiagram.io diagram](https://dbdiagram.io/d/LittleLives-665efcc6b65d933879769bc7)

## Thoughts
### The API
- POST `/users/register`
    - used to register user (very simple implementation)
    - made the middleware as simple as possible due to time constraints
- POST `/users/login`
    - login route to obtain token
- GET `/settings`
    - get all settings that have been seeded/set by user
- PUT `/settings/:key`
    - update key value pair in settings table
- GET `/appointments`
    - `req.body = { date: 'YYYY-MM-DD' }`
    - get a list of appointments for provided date
- POST `/appointments`
    - `req.body = { date: 'YYYY-MM-DD', time: 'HH:mm', available_slots: number | string }`
    - Create an appointment that is not in `/generate` route
- POST `/appointments/generate`
    - `req.body = { date: 'YYYY-MM-DD', available_slots: number | string }`
    - Generate a list of appointments for given date
- POST `/appointments/book`
    - Book the appointment based on appointment_id
    - if user already has appointment in progress, then they cannot book another
- DELETE `/appointments/:id`
    - delete appointment and increment the available_slots by 1

**`There should be admin route as well for more security but not enough time to implement it`**

Other than the above [Note](#note) section, everything else is done (inclusive of additional requirements in the documentation) except for admin capabilities (can be regarded as future enhancement).

## Rules
- each appointment slot is 30 minutes long
- appointments are available from 9am to 6pm on weekdays
    - meaning weekends are not available
- prevent double bookings for the same slot

## Route /appointments `{ query: { date: '2024-06-06' } }`
- should return appointments that are available on 2024-06-06


## Route /appointments/book `{ body: { appointmentId } }`
- should validate slot is available
- available slot should be deducted upon appointment made successfully

## Additional Requirements:
### Basic
1. Allow configuration of the appointment slot duration (minimum 5 minutes)
2. Enable setting maximum number of slots per appointment (1 to 5 slots)
3. Configure operational hours and days for scheduling appointments

### Advanced
1. implement functionality to set days off
2. allow setting unavailable hours within operation days

## Usage:
Already have everything setup properly with the pre scripts and dev script

```
npm install
npm run dev
```
