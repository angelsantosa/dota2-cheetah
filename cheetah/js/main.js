var dom_checker = false;
var commands_json = "/cheetah/fixtures/commands.json";
var heroes_json = "/cheetah/fixtures/heroes_merge.json";
var Views = {
  "header": {
    tagname: "header",
    el: $("header"),
    template: "templates/header.html",
    data: {
      title: "Cheetah!",
      version: 0.1
    }
  },
  "footer": {
    tagname: "footer",
    el: $("footer"),
    template: "templates/footer.html",
    data: {
      msg: "Loaded correctly",
      status: "ok",
    }
  },
  "main": {
    tagname: "main",
    el: $("main"),
    template: "templates/main.html",
    data: {}
  },
  "cat": {
    tagname: "cat",
    el: $("#cat"),
    template: "",
    data: {}
  }
}

var cats_nested, cats_json;
//viws
var Header = new CheetahTplManager(Views.header);
var StatusBar = new CheetahTplManager(Views.footer);
var CatMenu = new CheetahTplManager(Views.main);
//data
var CommandData = new CheetahJSONManager(commands_json);
var HeroData = new CheetahJSONManager(heroes_json);


$(document).ready(function() {
  cats_nested = CommandData.getNestedObject(".categories");
  cats_json = objToJSON(cats_nested);
  Header.render();
  StatusBar.render();
  CatMenu.renderData(cats_nested);

});

$(document).on("click", "#cat", function() {

  var heroes_clear = HeroData.getObject();
  var heroes_data = new CheetahDota2DataManger(heroes_clear, "heroes");

  var catname = $(this).attr('cat');
  var catid = $(this).attr('catid');
  var lecommands = CommandData.getNestedObject('.commands{.cat == ' + catid + '}');
  Views.cat = {
    tagname: "cateiner",
    el: $("#cateiner"),
    template: "templates/" + catname + ".html",
    data: {
      cat: {
        id: catid,
        name: catname
      },
      commands: lecommands
    }
  }
  var CatContainer = new CheetahTplManager(Views.cat);
  var is_redered = ".heroes";
  CatContainer.render(is_redered,function () {
    $("#heroes").select2({
      matcher: heroes_data.getMatcher,
      placeholder: "Select an option",
      width: "100%",
      data: heroes_data.getObjectSelect2(),
      dropdownAutoWidth: true,
      templateResult: heroes_data.getTemplateResult
    });
  });


});
