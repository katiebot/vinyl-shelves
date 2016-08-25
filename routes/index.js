var express = require('express');
var Discogs = require('disconnect').Client;
var fs = require('fs');
//var development = require('../knexfile').development
//var knex = require('knex')(development)
var accessData = {
  method: 'oauth',
  level: 0,
  consumerKey: 'lYPqTlgFzkkxSyKQojVB',
  consumerSecret: 'fwUKGbFwtuVhWsEKGVLDlDQVDUmkNDAA',
  token: 'JDxAQpPtIQYRFCEPdfzGsbEoaroJTVhVjJwfmQli',
  tokenSecret: 'BSMBfvOUFqGQbkkqtLiavcqkuQcmNWdnVvJkRhcw',
  authorizeUrl: 'https://www.discogs.com/oauth/authorize?oauth_token=JDxAQpPtIQYRFCEPdfzGsbEoaroJTVhVjJwfmQli'
};

var userAgent = 'VinylShelves/1.0';

module.exports = {
  get: get
};

function get(req, res) {
  var collection = new Discogs(userAgent).user().collection();
  var releasesArray = [];
  function setupCollection(req, collection, page) {

    // Get the collection
    getCollection(req, collection, page).then(function(response) {
      var releases = response.releases;
      var pages = response.pages;

      releasesArray = releasesArray.concat(releases);

      if (page < pages) {
        page++;
        setupCollection(req, collection, page);
      }
      else {
        // Split results into alphabetical arrays
        releasesArray = sortAndSplit(releasesArray);
        // Render
        res.render('index', {releases: releasesArray});
      }
    });
  }
  setupCollection(req, collection, 1);
}

function getCollection(req, collection, page) {
  return new Promise(function(resolve, reject) {
    collection.getReleases('katiebot', 0, {page: page, per_page: 100}, function(err, data) {
      if (err) console.log(err);
      if (data) {
        var releases = data.releases;
        var pages = data.pagination.pages;
        var db = new Discogs(userAgent, accessData).database(); // req.session.accessData
        for (var ii = 0; ii < releases.length; ii++) {
          // Get the images
          id = releases[ii].id;
          if (!fs.existsSync('./public/covers/' + id + '.jpg')) {
            getImage(db, id);
          }
          // Tidy the artist names
          releases[ii].artist = tidyArtistNames(releases[ii].basic_information.artists);
        }
        if (releases.length) {
          resolve({releases: releases, pages: pages});
        }
        reject('Failed to get collection');
      }
    });
  });
}

function getImage(db, id) {
  db.getRelease(id, function(err, data) {
    if (err) console.log(err);
    if (data && data.images) {
      var url = data.images[0].resource_url;
      if (url) {
        db.getImage(url, function(err, data, rateLimit) {
          if (err) console.log(err);
          if (data) {
            fs.writeFile('./public/covers/' + id + '.jpg', data, 'binary', function(err) {
              console.log(err);
            });
          }
        });
      }
    }
  });
}

function tidyArtistNames(artists) {
  var artistNames = '';
  for (var ii = 0; ii < artists.length; ii++) {
    artistNames += artists[ii].name;
    if (artists[ii].join.length > 0 && ii + 1 < Object.keys(artists).length) {
      artistNames += ' ' + artists[ii].join + ' ';
    }
  }

  return artistNames;
}

// TODO: use 'ans' value if it exists
function sortAndSplit(releases) {
  // Alphabetize results
  releases.sort(sortByArtist);

  // Split into objects keyed by first letter
  var alphabeticalReleases = {};
  for (var ii = 0; ii < releases.length; ii++) {
    var letter1 = releases[ii].artist.charAt(0);
    alphabeticalReleases[letter1] = [];
  }
  for (var jj = 0; jj < releases.length; jj++) {
    var letter2 = releases[jj].artist.charAt(0);
    alphabeticalReleases[letter2].push(releases[jj]);
  }

  return alphabeticalReleases;
}

function sortByArtist(a, b) {
  if (a.artist < b.artist) {
    return -1;
  }
  if (a.artist > b.artist) {
    return 1;
  }
  return 0;
}
