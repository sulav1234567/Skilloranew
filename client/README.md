requirements of hotels 
   |
   |
   v
hotels
   |
   v
front office --->       [ manages checkins and checkouts and customer details];
                                                   |
                                                   |
                                                   v
                                    For checkins and Checkouts the policies will be as follows:
                                    |
                                    |->     The Two Conditions are:
                                                     |
                                                     |
                                                    / \
                                                   /   \
                        if the customer is nepali        If the customer is non nepali:
                                    
# Algorithm of customer verification and checkin and checkout;

* If the customer is a nepali citizen
  1. front office staff asks for the legal nepali identification document of the customer [either citizenship or national id card or passport or driving liscense] ----> national id card and citizenship will be the highest priority.
  2. front office staff enters the details of the document given by the customer in the system .
      # The following details will be required;
       i. full name of the customer
       ii. date of birth of the customer
       iii. document type and document number of the customer
       iv. front and back photos of the document
       v. a on the spot photo of the customer
       v.gender of the customer

       # Disclaimer: the details of the customer will not be disclosed to anyone in any circumstances except if the legal warrent is assigned.
  3. After customer details verification , the front office staff assign a room to that customer and fill up the checkin and checkout date and time and provide the key

* If the customer is a non nepali citizen
  1. front office staff asks for the legal  identification document of the customer  ----> Only passport is valid for the non-nepali citizen
  2. front office staff enters the details of the document given by the customer in the system .
      # The following details will be required;
       i. full name of the customer
       ii. date of birth of the customer
       iii. document type and document number of the customer
       iv. document issue date and expiry date
       v. document issuing country
       vi. front and back photos of the document
       vii. a on the spot photo of the customer
       viii.gender of the customer

       # Disclaimer: the details of the customer will not be disclosed to anyone in any circumstances except if the legal warrent is assigned.
  3. After customer details verification , the front office staff assign a room to that customer and fill up the checkin and checkout date and time and provide the key



1. name of the hotel
2. location of the hotel
3. owner of the hotel ----> User
4. hotel login details ----> 