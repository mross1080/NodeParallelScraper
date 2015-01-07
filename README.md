Project Brief: 
Crawl all local business in the US on yelp. (try to start with California and New York)

Main Points:
You probably don't want to use Yelp API because it is very restrictive.
*I implemented a web crawler to avoid API rate limiting, there is much simpler logic to distribute a client sided crawler then a server side one which would need to manage multiple API key accounts.  If I used their API I would have to figure out exactly how much data you could pull without being limited, then distribute the tasks to pull exactly the max amount of data each API key is allowed.  Just scraping the actual site gave me all the data I needed even if its slower then using their API.

Optimize an algorithm to crawl a comprehensive list (be as complete as possible) of local businesses in the SHORTEST time possible.
*Node.js has a default library called Cluster, which allows you to easily fork multiple worker processes.  I implemented an algorithm to distribute each scraping to a worker based on how many cores the computer running it has.  

Basically, you need to figure out how to slice the geography on accurately and intelligently to get the data with minimal number of bans. (they may ban you)
*Each City has its own public directory.  The scraper finds each section of the directory(broken up by letter) and then finds the data within each page.  At least for cities US, the html hierarchy is set up the same.  In order to avoid bans I am running the scaper on an Amazon EC2 instance and using an Elastic IP address.  This Elastic IP address is one associated with my amazon account as opposed to my EC2 instance.  Therefore every time I run the scraper I just have to associate a new IP address to my account and remove the old one, that way Yelp won't be able to recognize the IP the crawler is coming from and ban it.  Right now you have to phyisically go into the Amazon Ec2 dashboard and change it, but if time permitted I would have ran a shell script to do it via the command line tools.  

Keep in mind that these data change all the time. We are looking for comprehensive data set but it will never be 100% complete
* All the data is sent to a MongoDB database and can be updated or removed at any time.  I set up on express web app which has API endpoints to collect the data and manage the DB.  

Plus: Make it a distributed crawler to crawl simultaneous to maximize throughput and reduce time
*The scraper is set up to run on a Amazon EC2 instance, right now I'm on the free tier so it is only running on one virtual core, but all you have to do is pay for more cores and the running time gets exponentially faster and forks more instances.  

Plus: Scalable script to crawl across the entire US. (may take more time / instance)
*Just need more cores, possibly another instance of the server with multiple cores.  You would also need a web app to distribute the jobs to the individual servers.  

Documentation:
==============

How to ssh onto the EC2 instance
--------------------------------
* ssh-add yoursshkey.pem
* ssh -i yoursshkey.pem ubuntu@elastic-ip-address

How to change the Elastic IP Address
--------------------------------

In the EC2 management console go to the Elastic IP secion
* The free tier can only have 5 Ip addresses so how you go from here depends on how much money you're spending
* Click on the unused Elastic IP Address, and associate it with your scraper instance.

Current API Endpoints
--------------------------------

post /search 
*Returns results of desired query

get /getListings
* Returns JSON of all business listings

get /removeListings
* Drops all collections in the DB(_Maybe not the most secure way of doing this_)
