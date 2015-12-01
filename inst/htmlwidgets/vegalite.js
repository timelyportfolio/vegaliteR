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
    
    
    x.spec.config = x.spec.config ? x.spec.config : { };
    x.spec.config.cell = x.spec.config.cell ? x.spec.config.cell : { };
    x.spec.config.cell.width = x.spec.config.cell.width ? 
          x.spec.config.cell.width : 
          el.getBoundingClientRect().width - 140;    
    x.spec.config.cell.height = x.spec.config.cell.height ? 
          x.spec.config.cell.height : 
          el.getBoundingClientRect().height - 40;
          

    var vgspec = vl.compile(x.spec).spec;
    parse(vgspec);

  },

  resize: function(el, width, height, instance) {

  }

});
