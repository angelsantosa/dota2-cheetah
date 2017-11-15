function stripDiacritics(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function sortByField(obj, field) {
  var ob = obj;
  var ob = ob.sort(function(a, b) {
    var an = a[field].toLowerCase();
    var bn = b[field].toLowerCase();
    if (an < bn) {
      return -1;
    } else {
      return 1;
    }
  });
  return ob;

}

function objToJSON(obj) {
  return JSON.stringify(obj);
}

class CheetahTplManager {
  constructor(data) {
    this._tpldata = data;
    this._tpl_el = data.el;
    this._tpl_template = data.template;
    this._tpl_data = data.data;
    this._tpl_tagname = data.tagname;
  }
  getData() {
    return this._tpl_data;
  }
  setData(data) {
    this._tpl_data = data;
  }
  renderData(data) {
    this.setData(data);
    this.render();
  }
  render() {

    var el = this._tpl_el;
    var tag = this._tpl_tagname;
    var data = this._tpl_data;
    $.Mustache.load(this._tpl_template).done(function() {
      return el.mustache(tag, data, {
        method: 'html'
      });
    });

  }
}

class CheetahSelect2Manager {
  constructor(render_el, checker_el, data, placeholder = "Select an option", ms = 20, select2class = ".select2-hidden-accessible") {
    this._render_el = render_el;
    this._checker_el = checker_el;
    this._data = data;
    this._placeholder = placeholder;
    this._ms = ms;
    this._select2class = select2class;
  }
  getSelect2Build() {

    var self = this;
    var data = self._data;

    $(self._render_el).select2({
      matcher: data.getMatcher,
      placeholder: self._placeholder,
      width: "100%",
      data: data.getObjectSelect2(),
      dropdownAutoWidth: true,
      templateResult: data.getTemplateResult
    });

  }

  build() {

    var self = this;
    var clax_checker = self._checker_el.concat(self._select2class);

    function _do() {
      var c = $(clax_checker).length;
      if (c) {
        clearInterval(_loop);
      } else self.getSelect2Build()
    }

    var _loop = setInterval(_do, self._ms);
  }

}

class CheetahJSONManager {

  constructor(json_file) {
    this._json_file = json_file;
    this._object = {};
    this.setObject();
  }

  setObject() {
    var these = this;
    var file = this._json_file;
    $.getJSON(file, function(d) {
      these._object = d;
    });

  }

  getObject(pathexp) {
    if (pathexp == undefined) {
      return this._object;
    } else {
      return JSPath.apply(pathexp, this._object);
    }
  }

  getNestedObject(pathexp) {
    var nst_object = {};
    var file = this._json_file;
    var these = this;
    var first, who, key;
    var obj = this.getObject(pathexp);

    if (pathexp == undefined) {
      return this._object;
    } else {
      $.each(obj, function(k, v) {
        if (key != k) {
          who = undefined;
          key = undefined;
          first = true;
        }
        $.each(v, function(n, m) {
          if (first) {
            key = k;
            nst_object[m.toString().toLowerCase()] = {};
            nst_object[m.toString().toLowerCase()][n] = m;
            first = false;
            who = m.toString().toLowerCase();
          } else {
            nst_object[who][n] = m;
          }
        });

      });
      return nst_object;
    }

  }

}

class CheetahDota2DataManger {

  constructor(obj, api) {
    this._api = api;
    this._obj = this.setObject(obj);
  }

  getImage(text, suff = "lg") {
    return "http://cdn.dota2.com/apps/dota2/images/" + this._api + "/" + text + "_" + suff + ".png";
  }

  setObject(ob) {
    /*
    sets image url and shortname
    */
    var self = this;
    var obj = $.map(ob, function(o) {
      o.simple_name = self.getRawName(o.name);
      o.image_url = self.getImage(o.simple_name);
      return o;
    });
    return obj;
  }

  getObjectSelect2() {
    var self = this;
    var original_object = self._obj;
    var new_data = $.map(original_object, function(o) {
      o.text = o.text || o.localized_name;
      return o;
    });
    return new_data;
  }

  getRawName(text) {
    var ntext = text.replace("npc_dota_hero_", "").replace("item_", "");
    return ntext;
  }

  getTemplateResult(data) {
    if (!data.id) {
      return data.text;
    }
    var $state = $(
      '<span><img width="50" src="' + data.image_url + '" class="img-flag" />' + data.text + '</span>'
    );
    return $state;
  }

  getMatcher(query, data) {
    /*
    This matcher doesnt allow childs, don't think ill implement it
    mostly depends on how easy or hard teh shops is to read
     */
    if ($.trim(query.term) === '') {
      return data;
    }

    if (typeof data.text === 'undefined' || data.text == "") {
      return null;
    }
    var i;

    var original = stripDiacritics(data.text.toUpperCase());
    var term = stripDiacritics(query.term.toUpperCase());
    var term_count = term.length;

    var abbs = data.abb;
    var abbs_count = abbs.length;
    var done = null;
    /*
    I could have pushed original to abbs but in this way it shows the
    results for hero names first, the abbs, this is a good way to move data later tho
    */
    if (term_count <= 2 && original[0] != term[0]) {
      return done;
    }
    if (original.indexOf(term) > -1) {
      return data;
    } else {
      for (i = 0; i < abbs_count; i++) {
        var upperabb = stripDiacritics(abbs[i].toUpperCase());
        if (upperabb.indexOf(term) > -1) {
          done = data;
          break;
        }
      }
      return done;
    }
    return done;
  }

}
