function PowerSword(adminEndpoint, RSVP) {
  this.adminEndpoint = adminEndpoint || 'http://localhost:4568/';
  this.RSVP = RSVP;

  this.getHeaders = function() {
    var token = localStorage.getItem('token-webkite');
    var headers = { 'Accept' : 'application/vnd.webkite.config+json; version=2' };
    if (token) {
      headers.Client = 'webkite';
      headers.Authorization = 'Bearer ' + JSON.parse(token).access_token;
    }
    return headers;
  };

  this.getAdminResource = function(location, follow, parser) {
    ps = this;
    return function(params) {
      return new ps.RSVP.Promise(function(resolve, reject) {
        traverson
          .jsonHal
          .from(location ? decodeURIComponent(params[location]) : ps.adminEndpoint)
          .newRequest()
          .follow(follow || [])
          .withRequestOptions({headers: ps.getHeaders()})
          .getResource(function(error, doc) {
            if (error) {
              console.error(error);
              reject(error);
            } else if (parser) {
              console.log(doc);
              resolve(parser(doc));
            } else {
              console.log(doc);
              resolve(doc);
            }
          });
      });
    };
  };

  this.postAdminResource = function(endPoint, follow, parser) {
    ps = this;
    return function(location, data) {
      return new ps.RSVP.Promise(function(resolve, reject) {
        traverson
          .jsonHal
          .from(location ? decodeURIComponent(params[location]) : ps.adminEndpoint)
          .newRequest()
          .follow(follow || [])
          .withRequestOptions({headers: ps.getHeaders()})
          .post(data, function(error, doc) {
            if (error) {
              console.error(error);
              reject(error);
            } else if (parser) {
              console.log(doc);
              resolve(parser(doc));
            } else {
              console.log(doc);
              resolve(doc);
            }
          });
      });
    };
  };

  this.getRootLinks = this.getAdminResource(null, null, function(doc) {
    return doc._links;
  });

  this.getUseCases = this.getAdminResource(null, 'use_cases', function(doc) {
    return doc._embedded.use_case;
  });

  this.getUseCase = this.getAdminResource('use_case_id');

  this.generateDataset = this.postAdminResource(null, ['generate_dataset']);
}
