# LittleLives Role Challenge
Develop a simplified appointment system. Develop a RESTful API for an endpoint scheduling system that supports creating, viewing and cancelling appointments, with configurable slots and operational parameters

Documentation for the task requirements can be found [here](https://docs.google.com/document/d/1fdzbEFDwJGPjBx_hQTvwRKe-KcO8vbr2Pqeau5n3PnA/edit)

<a id="note"></a>
## Note:
I started the project in Javascript and by the time I finished it at 7:20PM, I did not have time to convert the project to typescript which is a huge oversight. Apologies on this as I did not read the `Language` specified in the requirements (which is deeply regretable).

Database used is `postgresql`, the reason for this is mostly due to my familiarity of using postgres as opposed to MongoDB / mysql as I've been using Postgresql for more than 5 years and mysql is 3 years and MongoDB is at 2 years. Furthermore, the reason for a sql database as opposed to a noSQL database is due to the structure of the data having to be quite defined and not suited for a noSQL database.

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

**`There should be admin route as well for more security but not enough time to implement it`**

Other than the above [Note](#note) section, everything else is done (inclusive of additional requirements in the documentation) but just missing out on the cancel appointment and admin capabilities.

## Rules
- each appointment slot is 30 minutes long
- appointments are available from 9am to 6pm on weekdays
    - meaning weekends are not available
- prevent double bookings for the same slot

## Route /appointments { query: { date: '2024-06-06' } }
- should return appointments that are available on 2024-06-06


## Route /appointments/book { body: { appointmentId } }
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
