(function () {
    'use strict';
    var getAppId = 184;
    kintone.events.on([
        'app.record.edit.show',
        'app.record.create.show'
    ], function (event) {
        var myButton = document.createElement('button');
        myButton.id = 'get_button';
        myButton.className = 'gaia-ui-actionmenu-save';
        myButton.innerHTML = '機械セット';
        const element = kintone.app.record.getSpaceElement('button-space');
        element.appendChild(myButton);
        var alert_script2 = document.createElement('script');
        alert_script2.setAttribute('src', 'https://cdn.jsdelivr.net/npm/sweetalert2@11');
        alert_script2.async = true;
        alert_script2.defer = true;
        alert_script2.onload = function () {
            this.onload = function () { };
        };
        alert_script2.onreadystatechange = function () {
            if (this.readyState === 'complete') this.onload();
        };
        document.head.appendChild(alert_script2);

        function fetch(app_id, opt_query, opt_offset, opt_records) {
            var offset = opt_offset || 0;
            var records = opt_records || [];
            var query = opt_query || '';
            var id = app_id || kintone.app.getId();
            var params = {
                app: id,
                query: query + ' limit 500 offset ' + offset
            };
            return kintone.api('/k/v1/records', 'GET', params).then(function (resp) {
                records = records.concat(resp.records);
                if (resp.records.length === 500) {
                    return fetch(id, query, offset + 500, records);
                }
                return records;
            });
        }

        myButton.onclick = async function () {
            //=> match trường id  theo mã khách hàng
            var getevent = kintone.app.record.get();
            console.log(123, getevent.record);
            console.log(123, getevent.record.得意先コード.value);
            var dataApp = await fetch(getAppId); //`得意先コード in ("${getevent.record.レコード番号.value}")`
            var elemenhtml = '<tbody class="datatable-body">';
            dataApp.forEach(function (element, index) {
                console.log(element)
                elemenhtml += `<tr scope="row" data-mdb-index="${index}">
                  <td data-mdb-field="field_0">${element.保有機械番号.value}</td>
                  <td data-mdb-field="field_1">${element.機械セット名.value}</td>
                  <td data-mdb-field="field_2">${element.得意先名.value}</td> 
                  <td data-mdb-field="field_3">${element.セット廃棄日.value}</td>
                  <td data-mdb-field="field_4">${element.文字列__1行_.value}</td>
                  <td data-mdb-field="field_5">${element.得意先コード.value}</td>
                  <td data-mdb-field="field_6"> <div class="idvalue" id="${element.$id.value}">${element.$id.value}</div> </td>
                </tr>`;

            });
            elemenhtml += '</tbody>';
            console.log("data", dataApp);
            document.querySelector('#get_button').disabled = true;
            Swal.fire({
                title: '<strong>Select Data</strong>',
                customClass: 'swal-wide',
                html: `<div id="datatable" data-mdb-selectable="true" data-mdb-multi="true" class="datatable">
                            <div class="datatable-inner table-responsive ps" style="overflow: auto; position: relative;">
                              <table class="table datatable-table">
                                <thead class="datatable-header">
                                  <tr>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_0"></i>保有機械番号</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_1"></i>機械セット名</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_2"></i>得意先名</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_3"></i>セット廃棄日</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_4"></i>得意先略称2</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_5"></i>得意先コード</th>
                                    <th style="cursor: pointer;" scope="col"><i data-mdb-sort="field_6"></i>ID</th>
                                  </tr>
                                </thead>` + elemenhtml + `</table></div></div>`,
                showCancelButton: true,
                width: "100%",
                returnFocus: true,
                returnInputValueOnDeny: true,
                didOpen: () => {
                    var datatable = document.getElementById("datatable");
                    var pi = datatable.addEventListener("selectRows.mdb.datatable", e => { });
                    loadMdb();
                }
            }).then((result) => {
                console.log(result);
                if (result.isConfirmed) {
                    var collection2 = document.getElementsByClassName("idvalue");
                    var checkbox = document.querySelectorAll('.datatable-body .datatable-row-checkbox');
                    console.log(3,checkbox)
                    console.log(4,collection2)
                    // var arrid = [];
                    for (var i = 0; i < collection2.length; i++) {
                      console.log(1,checkbox[i] , checkbox[i].checked)
                    //   if (checkbox[i].checked) {
                    //     let find = dataApp.find(k => k.$id.value == collection2[i].getAttribute('id'));
                    //     arrayvalue.push({
                    //       value: {
                    //         'コミッション': { type: 'NUMBER', value: find.コミッション.value }, 
                    //         '日付': { type: 'DATE', value: find.日付.value },
                    //         '被保険者': { type: 'SINGLE_LINE_TEXT', value: find.被保険者.value },
                    //         'ポリシー番号': { type: 'SINGLE_LINE_TEXT', value: find.ポリシー番号.value },
                    //         '商品コード': { type: 'SINGLE_LINE_TEXT', value: find.商品コード.value },
                    //         '商品名': { type: 'SINGLE_LINE_TEXT', value: find.商品名.value },
                    //         '総入金額': { type: 'NUMBER', value: find.総入金額.value },
                    //         'コミッション': { type: 'NUMBER', value: find.コミッション.value },
                    //         '備考': { type: 'SINGLE_LINE_TEXT', value: find.備考.value },
                    //         '支払月': { type: 'SINGLE_LINE_TEXT', value: find.支払月.value },
                    //         '支払回数': { type: 'SINGLE_LINE_TEXT', value: find.支払回数.value },
                    //         '支払フラグ': { type: 'RADIO_BUTTON', value: find.支払フラグ.value },
                    //         'コミッション管理_レコード番号': { type: 'NUMBER', value: find.$id.value },
                    //       }
                    //     });
                    //   }
                    }
                    // kintone.app.record.set(data);
                }
                document.querySelector('#get_button').disabled = false;
            });

        }
    });
})();
