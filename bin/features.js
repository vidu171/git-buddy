var _repo = require('../assets/repo.json');

//Returns the array of keys available in repo.json
function getListOfRepoAvailable(){
    return Object.keys( _repo);
} 




/**
*-----EXPORTS------
*/

module.exports= {
    getListOfRepoAvailable : getListOfRepoAvailable(),
    repo : _repo,
    
}