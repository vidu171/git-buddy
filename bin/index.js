#!/usr/bin/env node
    
var program = require('commander');
const features = require ('./features.js');
var fs = require('fs');
var colors = require('colors');
const rp = require('request-promise');
const cheerio = require('cheerio');



/**
 * Functions that i couldn't export
 */


//Returns the head of the selected repo
function getPresentHead(keyname){
    //default path
    var path = features.repo[""+keyname][1]+"/.git"

    var branch = (fs.readFileSync(path+"/HEAD")).toString().split('/')[2].trim();
    var ref = (fs.readFileSync(path+"/refs/heads/"+ branch)).toString();
    
    branch = (branch.green);
    return branch + ':' + ref;
}


// //fethes the head of the selected repo
// function fetchHead(keyname){
//     var url = features.repo[""+keyname][0]+"/.git";
//     return request(url)
//         .then( heads =>{
//             let references = _headfetcher(url)
//         }
//     )

// }


function _fetchAll(){
    for (key in features.repo){
        _headfetcher(key);
    }
    
}

function _headfetcher(keyname){
    var path = features.repo[""+keyname][1]+"/.git"
    var branch; 
    try{
        branch =  (fs.readFileSync(path+"/HEAD")).toString().split('/')[2].trim();
    }
    catch(err){
        message = ("path ".red+ path.red + " doesn't exist".red)+"\n"
        console.log(message);
        return;
    }
    const options = {
    uri: features.repo[keyname][0]+"/commits/"+branch,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  rp(options)
  .then(($) => {
	var heads = [];
	$('clipboard-copy').each(function(i, elem) {
      heads[i] = $(this).attr('value');
      heads[i] = heads[i].replace(",",'');
    });   
	
	$('.commit-title').each(function(i, elem) {
		heads[i] += " | "+  $(elem).text();
		heads[i] = heads[i].replace('…','');
		heads[i] = heads[i].replace(/\s+/g,' ');
		heads[i] = heads[i].substring(1,heads[i].length - 1)
	})	  

	var msg = ""
	var ref = getPresentHead(keyname).split(":")[1]
	if(ref = heads[0]){
		message = ("NO PULL REQUIRED FOR REPO : "+ keyname.yellow)+"\n\n"
	}else{
		message = ("PULL REQUIRED".yellow)+"\n\n"
	}
	
	console.log(message)
    console.log(heads)
  })
  .catch((err) => {
    console.log(err);
  });
    
}



/**
 * -l --list -> Lists down all the repositories from the repo.json
 * -h --head -> Gets the local head of the repo selected path to be defined in repo.json
 * -f --fetch -> Fetches the head of the repo selected
 * -a --autor -> Displays the author
 */
program
    .version('0.0.1', '-v' , '--version')
    .option('-l, --list', 'The available repo in repo.json are')
    .option('-h, --head <keyname>', 'Get the head of the selected repo')
    .option('-f, --fetch <keyname>', 'Fetches the repo head currently works for public repo only')
    .option('-a, --all', 'Fetech the repo head for all everything in the json array')
    .parse(process.argv);

/**
 * Logic of all the program here
 */

if(program.list){
    var feat = ' ' + features.getListOfRepoAvailable;
    feat = feat.replace(/,/g, '\n ');
    console.log (feat.blue)
}
    

else if(program.head){
    var present_head = " " + getPresentHead(program.head);
    console.log(present_head.green);
}

else if(program.fetch){
    _headfetcher(program.fetch);
}
else if(program.all){
    _fetchAll();

}