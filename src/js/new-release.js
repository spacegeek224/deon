var RELEASE_LINK_MAP = {
  spotify: {
    label: 'Listen on Spotify',
    icon: 'spotify',
    cta: 'Play'
  },
  itunes: {
    cta: 'Download',
    label: 'iTunes',
    icon: 'apple'
  },
  googleplay: {
    cta: 'Download',
    label: 'Google Play',
    icon: 'google'
  },
  applemusic: {
    cta: 'Play',
    icon: 'apple',
    label: 'Apple Music'
  },
  bandcamp: {
    cta: 'Go To',
    label: 'Bandcamp',
    icon: 'bandcamp'
  },
  youtube: {
    cta: 'Watch',
    label: 'Watch on YouTube',
    icon: 'youtube'
  },
  soundcloud: {
    cta: 'Listen',
    label: 'Listen on SoundCloud',
    icon: 'soundcloud'
  }
}

function getTracksArtists (tracks) {
  var artists = [];
  var artistIds = [];
  tracks.forEach(function (track) {
    track.artistsList.forEach(function (artist) {
      if (artistIds.indexOf(artist._id) == -1) {
        artists.push(transformWebsiteDetails(artist));
        artistIds.push(artist._id);
      }
    })
  })

  return artists;
}

function transformReleasePage (obj, done) {
  var scope = {}
  scope.release = mapRelease(obj);
  requestJSON({
    url: endpoint + '/catalog/browse/?albumId=' + scope.release._id
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
      scope.releaseArtists = getTracksArtists(tracks);
      scope.coverImage = (scope.release.cover);
      scope.tracks = tracks;
      scope.hasManyTracks = scope.tracks.length > 1
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

    if (samesame == 10) {
      EPPZScrollTo.scrollTo(document.querySelector('.release-page'), 0, 1500);
    }
    else {
      setTimeout(checkHeight, 25);
    }

    prevHeight = currentHeight;
  }

  checkHeight();
}
