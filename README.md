#Project Title:Blockchain Portfolio Token Ticker Application<br>
#Project Objective:
For the given csv(comma seperated values) that represents a user daily transactions and it contains following information:(timestamps,transaction_type,token,amount).The program must be able to return 4 different type of result that is obtained from manipulation of the given csv data.The different set of results are:

    1.Given no parameters, return the latest portfolio value per token in USD
    2.Given a token, return the latest portfolio value for that token in USD
    3.Given a date, return the portfolio value per token in USD on that date
    4.Given a date and a token, return the portfolio value of that token in USD on that date

#Data Description:The data to be manipulated has :timestamps that are the Epoch date,transaction_type can be either DEPOSIT or WITHDRAW,token are only of three type i.e 'BTC','ETH','XRP'

