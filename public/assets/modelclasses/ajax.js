var Save_Process =
{
  save: function onValidate(form,url) {
    alert("url");
    /*    var scrno = '555';*/
   // var form = $('#form');
    form.parsley().validate();
    if (form.parsley().isValid()) {
      alert('valid');
//      var formdata = $('#form').serializeArray();

                            //structure json
                       /*     var data = formdata.reduce(function(a, x) {
                              a[x.name] = x.value;
                              return a;
                            }, {});
                            Screenfields.push(data);*/
                          //  alert(JSON.stringify(Screenfields));
                       /*   $.ajax({
                            type: "POST",
                            url: "/savedata",
                            timeout: 6000,
                            contentType: 'application/json',
                            data: JSON.stringify({
                              scrid: "566",
                              formdata: JSON.stringify(Screenfields)
                            }),
                            success: function(data) {
                              var fdata = JSON.parse(JSON.stringify(data));
                              if (fdata.status == '1') {
                                Screenfields = [];
                                alert("Data saved successfully");
                                $('#formf').trigger("reset");
                                $('#modal-dialog1').modal('hide');
                              } else {

                               alert(fdata.err_msg);
                               Screenfields = [];
                             }
                           }

                         });*/
                       //  alert(Screenfields);
                       } else {
                        alert('Form not valid');
                      }
                    };
                  }