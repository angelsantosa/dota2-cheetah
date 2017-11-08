class CheetahTplManager{
  constructor(data){
    this._tpldata = data;
    this._tpl_el = data.el;
    this._tpl_template = data.template;
    this._tpl_data = data.data;
    this._tpl_tagname = data.tagname;
  }
  getData(){
    return this._tpl_data;
  }
  setData(data){
    this._tpl_data = data;
  }
  renderData(data){
    this.setData(data);
    this.render();
  }
  render(){
    var el = this._tpl_el;
    var tag = this._tpl_tagname;
    var data = this._tpl_data;
    $.Mustache.load(this._tpl_template).done(function(){
      el.mustache(tag, data, { method: 'html' });
    });
  }
}

class CheetahJSONManager{

  constructor(json_file){
    this._json_file = json_file;
    this._object = {};

  }

  setObject(){
    $.getJSON(this._json_file, function (d) {
      this._object = d;
      console.log(this._object)
    });
  }

  getObject(){
    return this._object;
  }
  
  getNestedObject(object_name){
    var nst_object = {};
    var first,who,key;
    $.getJSON(this._json_file, function (d) {
      $.each(d[object_name], function (k,v) {
        if(key!=k){
          who=undefined;
          key=undefined;
          first= true;
        }
        $.each(v,function (n,m) {
          if(first){
            key = k;
            nst_object[m.toString().toLowerCase()]={};
            nst_object[m.toString().toLowerCase()][n]=m;
            first = false;
            who = m.toString().toLowerCase();
          }else{
            nst_object[who][n]=m;
          }
        });

      });
    });
    return nst_object;
  }

}
