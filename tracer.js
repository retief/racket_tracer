$('.shrunkenCall').live('click',function (event) {
  var target = $(this)
  target.data("oldClass",target.attr("class"))
  target.data("oldHTML",target.contents())

  target.data('node').expanded = true
  showTree(target.data('node'),target)
})

$('.delButton').live('click',function (event) {
  var target = $(event.target)
  var parent = target.parents('.expandedCall').first()
  parent.data('node').expanded = false
  //parent.data("delProf", parent.contents())
  parent.empty()
  parent.attr("class",parent.data("oldClass"))
  parent.append(parent.data("oldHTML"))
  event.stopPropagation();
})

function element(tag) {
  return $("<"+tag+'/>')
}

function makeShrunkenCall(child,parent) {
  var newDisplay = element('div');
  newDisplay.addClass('shrunkenCall');
  newDisplay.addClass('call');
  $(newDisplay).data("node",child)

  if (parent.hasClass("background1"))
    newDisplay.addClass('background2');
  else
    newDisplay.addClass("background1")
  
  table = element('table')
  var row = element('tr');

  funcName = element('td'); funcName.addClass('name');
  funcName.text(child.name); row.append(funcName);

  for (j = 0; j < child.actuals.length; j++) {
    var arg = element('td');
    arg.text(child.actualsShort[j]);
    row.append(arg);}

  arrow = element('td'); arrow.addClass('arrow'); 
  arrow.text(' => '); row.append(arrow);

  result = element('td');
  result.text(child.resultShort);
  row.append(result);

  table.append(row);
  newDisplay.append(table);
  
  return newDisplay
}

function makeArg(arg,otherForm) {
  formalTD = element('td')
  formalTD.addClass("arg")
  
  formalDiv = element("div")
  formalDiv.text(arg)
  formalDiv.addClass("expandable")
  formalDiv.data("otherForm",otherForm)
  formalTD.append(formalDiv)
  return formalTD
}

function showTree(traceNode, displayWhere) {
  displayWhere = $(displayWhere)
  displayWhere.empty()
  
  var upperTable = element('table');
  displayWhere.append(upperTable);

  var upperTR = element('tr');
  actualsTR = element('tr');

  var delTD = element('td')
  delTD.attr("rowspan",2)
  delTD.addClass('delButton');
  var delButton = element('div');
  delButton.text(' X ');
  delButton.attr("rowspan",2);
  delTD.append(delButton);
  upperTR.append(delTD)
  var nameTD = element('td')
  nameTD.attr("rowspan",2)
  nameTD.text(traceNode.name)
  nameTD.addClass("name")
  upperTR.append(nameTD)

  for (var i = 0; i < traceNode.formals.length; i++) {
    upperTR.append(makeArg(traceNode.formalsShort[i],traceNode.formals[i]))
    actualsTR.append(makeArg(traceNode.actualsShort[i],traceNode.actuals[i]))
  }

  var arrow = element('td')
  arrow.attr("rowspan",2)
  arrow.text("=>")
  arrow.addClass("arrow")
  upperTR.append(arrow)

  var resultTD = element('td')
  resultTD.attr("rowspan",2)
  resultTD.text(traceNode.resultShort)
  resultTD.data("otherForm",traceNode.result)
  resultTD.addClass("result")
  resultTD.addClass("expandable")
  upperTR.append(resultTD)

  upperTable.append(upperTR);
  upperTable.append(actualsTR);
  upperTable.addClass("callTable")
  
  var lowerTable = element('table')
  lowerTable.addClass("childTable")
  var lowerRow = element('tr');
  lowerTable.append(lowerRow)
  
  var divArray = []	  
  
  for (i = 0; i < traceNode.children.length; i++) {
    cell = element('td')
    shrunkDiv = makeShrunkenCall(traceNode.children[i],displayWhere);
    cell.append(shrunkDiv)
    
    lowerRow.append(cell);
    divArray[i] = shrunkDiv;
  }
  displayWhere.append(lowerTable);
  
  displayWhere.removeClass('shrunkenCall');
  displayWhere.addClass('expandedCall');

  for (i = 0; i < traceNode.children.length; i++) {
    if (traceNode.children[i].expanded == true) {
      divArray[i].trigger('click')
    }
  }
}

$(document).ready(function () {
  var div = $("#tabbar")
  var ul = element("ul")
  ul.addClass("tabs")
  div.append(ul)
  var first = false
  for (var i = 0; i < theTrace.children.length; i++) {
    var li = element("li")
    if (!first)
      first = li
    li.data("child",i)
    li.text(theTrace.children[i].name)
    ul.append(li)
  }
  first.trigger('click')
})

$('ul.tabs li').live('click', function (event) {
  target = $(this)
  var div = $("#tracer")
  div.empty()
  var child = makeShrunkenCall(theTrace.children[target.data("child")],$(document.body))
  div.append(child)
  child.trigger('click')
  $("ul.tabs li.picked").removeClass("picked")
  target.addClass("picked")
})

$(".expandable").live("click", function (event) {
  target = $(this)
  var newText = target.data("otherForm")
  target.data("otherForm",target.text())
  target.text(newText)
})
