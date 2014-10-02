(function() {
  var geojson_precision = {};

  function parse(t, precision) {

    function point(p) {
      return p.map(function(e) {
        return 1 * e.toFixed(precision);
      });
    }

    function multi(l) {
      return l.map(point);
    }

    function poly(p) {
      return p.map(multi);
    }

    function multiPoly(m) {
      return m.map(poly);
    }

    function multiLine(m) {
      return m.map(multi);
    }

    function geometry(obj) {
      switch (obj.type) {
        case "Point":
          obj.coordinates = point(obj.coordinates);
          return obj;
        case "LineString":
        case "MultiPoint":
          obj.coordinates = multi(obj.coordinates);
          return obj;
        case "Polygon":
          obj.coordinates = poly(obj.coordinates);
          return obj;
        case "MultiPolygon":
          obj.coordinates = multiPoly(obj.coordinates);
          return obj;
        case "MultiLineString":
          obj.coordinates = multiLine(obj.coordinates);
          return obj;
        default :
          throw new Error("Something went horrifically wrong");
      }
    }

    function feature(obj) {
      obj.geometry = geometry(obj.geometry);
      return obj
    }

    function featureCollection(f) {
      f.features = f.features.map(feature);
      return f;
    }

    function geometryCollection(g) {
      g.geometries = g.geometries.map(geometry);
      return g;
    }

    switch (t.type) {
      case "Feature":
        return feature(t);
      case "GeometryCollection" :
        return geometryCollection(t);
      case "FeatureCollection" :
        return featureCollection(t);
      case "Point":
      case "LineString":
      case "Polygon":
      case "MultiPoint":
      case "MultiPolygon":
      case "MultiLineString":
        return geometry(t);
      default :
        throw new Error("GeoJSON object is invalid");
    }
      
  }

  geojson_precision.parse = parse;

  module.exports = geojson_precision;

}());
  
