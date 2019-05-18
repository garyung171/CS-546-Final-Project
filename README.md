# Looking For Group
Looking For Group is a website which allows people who live in the same location and have at least one shared prefrences to create meetups to play games
## Installation
Use the package manager [npm](https://www.npmjs.com/)
```bash
npm install
```
## Prerequisites
Before running the app you must have a mongodb instance running
```bash
sudo mongod (on linux)
(Then enter your password)
```
## Usage
To begin the program which resets the seed and runs the app
```bash
npm reset
```
To begin the program without resetting 
```bash
npm start
```
## Test User
We have created two users which you can use 

The first user is 

Username:

masterdetective123

Password:

blah1

The second user is 

Username:

lemon

Password:

blah2

## Using the "Looking for Group Project"
This website serves as a way for people who want to play video games/ board games with people in physical meetups, to connect with others based on location and preferences. A user will first be directed to our main page, where if they have an account, they can sign in, or if they are just joining, they have to go through the registration form. Assuming a user just registered, they will be directed to their profile page, where they can edit their preferences, or anything else about their profile such as username, password, location, or email. Once they update their preferences, they can click on the "Find Meetups" tab to direct them to another landing page that lists all the meetups that are relevant to that user. Relevance is done based on location as well as the preferences of the user compared to the preferences of the meetup. A meetup is created by any user, that has a specified location, name, date, list of preferences, and a comment area. As long as a user matches the location of an event, and at least one preference, they will be shown this event in their "Find Meetups" tab. The "Find Meetups" tab lists all the relevant meetups, but with a limited description. If the user wants to know more about a specific meetup, they can click the "Details" button on a meetup of their choice. This will direct them to a more in depth view of the meetup, which will show them all of the contents. This detailed view is where a user can choose to "Join" the meetup, "Comment" on it, or if they have already joined the meetup they can choose to "Leave" that meetup. Featured in the "Account" dropdown,  is the option to list all of the meetups a user has signed up for in order of their upcoming date. This directs them to a page the shows minimal descriptions of each meetup, and if they want more info they can click the "Details" button. Also in this dropdown, is the ability to choose "Create a Meetup",  which allows a user to create a meetup with a specified name, preferences, date, and location. By default the creator of the meetup is added on the list of "Attendees".  The dropdown also features an option to change the user's profile, which directs to a page that gives them the option to change any aspect of their profile, assuming their change is in compliance to the database restrictions, i.e. no repeated usernames. Also shown in the navbar is a search box, which allows users to enter the name of a meetup they have signed up for, and be directed to a page that shows a brief description of it, and if they want more of a description they can press the "Details" button. One more button in the navbar, is the "Home" button, which directs to the user's profle page. Lastly is the logout button which signs out the user from the given session.

## Pledge
"I pledge my honor that I have abided by the Stevens Honor System."
Gary Ung gung 10428192
Daniel Shapiro dshapir1 10427275
Ian Gomez igomez1 104248821