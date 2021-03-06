import Ember from 'ember';
var miki = nodeRequire('./miki.js');

function quoteRender(wikitext) {
  var render_opts = {
      anchors:[
          {re: /(<a href=\')(w:(.[^>]+))(\'>)/gi,
           sub:'<a class=\'a-out\' href=\'https://es.wikipedia.org/wiki/$3$4'},
          {re: /(<a href=\')((.[^w:>]+))(\'>)/gi,
           sub:'$1#/show/$2$4'}
      ]
  };
  miki.parse(wikitext);
  var html = miki.as_html(render_opts);

  return new Ember.Handlebars.SafeString(html);
}

export default Ember.Component.extend({
    datahtml: new Ember.Handlebars.SafeString('<img src="images/spiffygif_28x28.gif" alt="Cargando">'),
    actions: {
        isExternal: function(){}
    },
    didInsertElement: function() {
        var safehtml = quoteRender(this.get('data'));
        this.set('datahtml', safehtml);
        Ember.run.scheduleOnce('afterRender', this, function() {
            var anchors_out = this.$('.a-out');
            anchors_out.on('click',
                           function(e){
                               console.log(this.href);
                               nodeRequire('nw.gui').Shell.openExternal( this.href );
                               e.preventDefault();
                           });
        });
    }
});
