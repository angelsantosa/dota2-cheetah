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
    console.log(this._tpl_tagname);
    var el = this._tpl_el;
    var tag = this._tpl_tagname;
    var data = this._tpl_data;
    $.Mustache.load(this._tpl_template).done(function(){
      el.mustache(tag, data, { method: 'html' });
    });
  }
}
