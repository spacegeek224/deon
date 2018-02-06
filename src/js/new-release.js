function transformReleasePage (obj, done) {
  var scope = {}
  scope.tracks = transformTracks(obj, function (err, tracks) {
    scope.release = mapRelease(obj.results[0].release);
    scope.coverImage = (scope.release.cover);
    return done(null, scope);
  });

}

function completedReleasePage () {
  EPPZScrollTo.scrollTo(document.querySelector('.release-page'), 0, 1500);
}
