HTMLWidgets.widget({

  name: 'vegalite',

  type: 'output',

  initialize: function(el, width, height) {

    return {}

  },

  renderValue: function(el, x, instance) {

    function parse(spec) {
      vg.parse.spec(spec, function(chart) {
          chart({el:el,renderer:x.renderer}).update(); });
    }
  
    var vgspec = vl.compile(x.spec);
    parse(vgspec);

  },

  resize: function(el, width, height, instance) {

  }

});
