var RELEASE_LINK_MAP = {
  spotify: {
    label: 'List on Spotify',
    icon: 'spotify'
  }
}

function getTracksArtists (tracks) {
  var artists = [];
  var artistIds = [];
  tracks.forEach(function (track) {
    track.artistsList.forEach(function (artist) {
      if (artistIds.indexOf(artist._id) == -1) {
        artists.push(artist);
        artistIds.push(artist._id);
      }
    })
  })

  return artists;
}

function transformReleasePage (obj, done) {
  var scope = {}
  scope.release = mapRelease(obj);
  console.log('scope.release.urls',scope.release.urls);
  requestJSON({
    url: endpoint + '/catalog/browse/?albumId=' + scope.release._id
  }, function (err, result) {
    if(err) {
      return done(err);
    }
    console.log('result',result);
    transformTracks(result, function (err, tracks) {
      console.log('tracks', tracks);
      if(err) {
        return done(err);
      }
      scope.artists = getTracksArtists(tracks);
      scope.coverImage = (scope.release.cover);
      scope.tracks = tracks;
      return done(null, scope);
    });
  });
}

function completedReleasePage () {
  EPPZScrollTo.scrollTo(document.querySelector('.release-page'), 0, 1500);
}
