(function() {
    var app = angular.module('aktin.input', []);

    app.directive("variedInput", ['$compile', '$parse', function($compile, $parse){
        var tmpl = $compile('<input class="{{property.fieldClass}}" type="text" name="{{property.name}}" value="{{property.value}}">');

        propertyType = "";
        var directiveObj = {   
            restrict : 'AEC',
            link : function (scope, element, attr) {
                scope.type = attr.type;
                var newEl = angular.element('<input type="text"/>');
                newEl.attr('name', 'hallo');

                propertyType = attr.type;
                // console.log("propertyType 1", propertyType);
                // console.log(scope, element, attr);
                // tmpl(scope, function(fieldEl, scope){
                //     $compile(newEl[0].outerHTML)(scope, function(el, scope){
                //         fieldEl.append(el);
                //         element.append(fieldEl);
                //     });
                // });
                var t2 = $compile('<div>123</div> <div ng-include="\'properties/input_' + attr.type + '_template.html\'"></div>');
                t2(scope, function(fieldEl, scope){
                    element.append(fieldEl);
                });
            },
            // compile : function (element, attr) {
            //  console.log(attr);
            //  element.append();
            // },
            //template : '<p>textdirective: {{property.descr}} </p><div class="ui input"><input class="{{property.fieldClass}}" type="text" name="{{property.name}}" value="{{property.value}}"></div>',
        }

        console.log("propertyType", propertyType);
        return directiveObj;
    }]);


    var inputHtml = {
        'number' : '<input class="{{property.fieldClass}}" type="{{property.inputField}}" name="{{property.name}}" value="{{property.value}}" ng-disabled="!properties.writeAble(property)">',
        'text' : '<input class="{{property.fieldClass}}" type="text" name="{{property.name}}" value="{{property.value}}"  ng-disabled="!properties.writeAble(property)">',
        'email' : '<input class="{{property.fieldClass}}" type="email" name="{{property.name}}" value="{{property.value}}"  ng-disabled="!properties.writeAble(property)">',
    }

})();
