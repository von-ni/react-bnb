1. Introduction
The Three Node Resort Database Backend API serves as the backbone for managing and accessing data related to the resort operations. 
This technical document provides an overview of the API, its endpoints, authentication, data models, and usage guidelines.

2. API Endpoints

2.1. /api/auth/member
POST: Authenticate member & obtain token -*

2.2. /api/bookings/member
GET: Find bookings for a member 

2.3. /api/bookings/booking
POST: Create a booking
  Request Body: Include a JSON object with every properties in Booking Schema expect for member.

2.4. /api/bookings/booking/:roomType
GET: Find all reserved dates for typed room -*

2.5 /api/members/member
GET: Find a member
POST: Register a member -*
  Request Body: Include a JSON object with the same properties as Member.
PUT: Update a member
  Request Body: The same as POST.

2.6 /api/rooms/price/search?roomType=xxx&start=YYYY-MM-DD&end=YYYY-MM-DD
GET: Get price per roomType during [star,end] -*

2.7 /api/rooms/price
POST: Set price for a day
  Request Body: Include a JSON object with the following properties:
    roomType (string): Room name.
    dates (string): .
    price (string): Price of the room.
PUT: Update price for a day.
  Request Body: The same as POST.

2.8 /api/rooms/prices
POST: Set prices for each day during [star,end]
  Request Body: Include a JSON object with the following properties:
    roomType (string): Room name.
    datesStart (string): 
    datesEnd (string):
    price (string): Price of the room.

3. Authentication and Security
The API requires authentication to ensure data security and access control. Users need to include an access token in the request headers for authorization purposes. Detailed instructions for obtaining authentication credentials is provided at 2.1. Also, notice that API with * can be accessed without authentication.

4. Data Models

4.1. Member Model
id: Unique identifier for the member, auto generated.
name:
  firstName: First name of the member
  lastName: Last name of the member  
email: Email of the Member
password: Have to be 8 or more characters and contains minimum 1 uppercase,lowercase and number.
createDate: Creation day of the file, auto generated.

4.2. Booking Model
id: Unique identifier for the booking, auto generated.
datesDetail: a list of dates
    dates:
      year: Year of the booking day 
      month: Month of the booking day
      date: Date of the booking day
      price: Price at the booking
roomType: Room name
details: 
    member: Member id 
    adults: Audlts number will be checked in
    children: Children number will be checked in
    infant: Infants number will be checked in
    cardNo: Only take Mastercard and Visa cards.
    cardholder: Name of the cardholder.
    expirationDate: Expiration date of the cards.
    cvc: 
    createDate: The date creating the booking, auto generated.

4.3 Room Model
roomType: Room name
prices: a list of prices at specific day
  dates:
    year: Year of the specific day 
    month: Month of the specific day
    date: Date of the specific day
    price: List of price at the specific day, updated price at the end of the list.

5. Usage Guidelines
5.1. Request and Response Formats
All requests and responses should use the JSON format.
Use standard HTTP status codes to indicate the success or failure of API requests.

5.2. Error Handling
Provide clear and informative error messages for common errors or exceptional scenarios.
Follow consistent error response formats and include appropriate error codes and descriptions.
Example: res.status(400).json({ errors: errors.array() })

