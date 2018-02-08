//Links from higher priority platforms will appear higher on the page
var RELEASE_LINK_MAP = {
  spotify: {
    label: 'Listen on Spotify',
    icon: 'spotify',
    cta: 'Play',
    priority: 100
  },
  itunes: {
    cta: 'Download',
    label: 'iTunes',
    icon: 'apple',
    priority: 90
  },
  applemusic: {
    cta: 'Play',
    icon: 'apple',
    label: 'Apple Music',
    priority: 80
  },
  googleplay: {
    cta: 'Download',
    label: 'Google Play',
    icon: 'google',
    priority: 70
  },
  bandcamp: {
    cta: 'Go To',
    label: 'Bandcamp',
    icon: 'bandcamp',
    priority: 60
  },
  soundcloud: {
    cta: 'Listen',
    label: 'SoundCloud',
    icon: 'soundcloud'
  },
  youtube: {
    cta: 'Watch',
    label: 'Watch on YouTube',
    icon: 'youtube'
  }
}

function getAllTracksWebsiteArtists (tracks) {
  var artists = [];
  var artistIds = [];
  tracks.forEach(function (track) {
    track.artistDetails.forEach(function (artist) {
      if (artistIds.indexOf(artist._id) == -1) {
        artists.push(transformWebsiteDetails(artist));
        artistIds.push(artist._id);
      }
    })
  })

  return artists;
}

function transformReleaseMerch (obj) {
  shuffle(obj.products)
  obj.products = obj.products.slice(0,8)
  return obj
}

function transformReleasePage (obj, done) {
  console.log('obj',obj);
  var scope = {}
  scope.release = mapRelease(obj);
  requestJSON({
    url: endpoint + '/catalog/browse/?albumId=' + scope.release._id,
    withCredentials: true
  }, function (err, result) {
    if(err) {
      return done(err);
    }
    transformTracks(result, function (err, tracks) {
      tracks = tracks.map(function (track, index) {
        track.trackNumber = index + 1;
        return track;
      })
      if(err) {
        return done(err);
      }
      scope.releaseArtists = getAllTracksWebsiteArtists(tracks);
      scope.numArtistBeakpoints = [];
      scope.coverImage = (scope.release.cover);
      scope.tracks = tracks;
      scope.hasManyTracks = scope.tracks.length > 1
      scope.showMerch = true;
      for(var i = 0; i <= scope.releaseArtists.length; i++) {
        scope.numArtistBeakpoints.push('gte-' + (i + 1))
      }
      if(scope.releaseArtists.length >= 6) {
        scope.showMerch = false;
      }
      return done(null, scope);
    });
  });
}

function completedReleasePage () {
  var prevHeight = 0;
  var samesame = 0;
  function checkHeight () {
    var currentHeight = document.body.scrollHeight;
    if (currentHeight == prevHeight) {
      samesame++
    }
    else {
      samesame = 0;
    }

    if (samesame == 100) {
      EPPZScrollTo.scrollTo(document.querySelector('.release-page'), 0, 500);
    }
    else {
      setTimeout(checkHeight, 10);
    }

    prevHeight = currentHeight;
  }

  checkHeight();
}
