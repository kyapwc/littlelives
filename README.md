Rules:
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
