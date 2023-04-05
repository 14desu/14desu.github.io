var kr_fighterinfo_api = [];
var kr_torpedoinfo_api = [];
var kr_bomberinfo_api = [];
var kr_scoutinfo_api = [];

$(document).ready(function () {
    kr_aircraft_info_api();
});

$(document).on("change", ".fighter_input", function () {
    let table = $('#fighter_output').DataTable();
    table.destroy();
    fighter_output();
});

$(document).on("change", ".torpedo_input", function () {
    let table = $('#torpedo_output').DataTable();
    table.destroy();
    torpedo_output();
});

$(document).on("change", ".bomber_input", function () {
    let table = $('#bomber_output').DataTable();
    table.destroy();
    bomber_output();
});

$(document).on("change", ".scout_input", function () {
    let table = $('#scout_output').DataTable();
    table.destroy();
    scout_output();
});

function kr_aircraft_info_api() {

    const kr_aircraft_info_api_URL = "https://script.google.com/macros/s/AKfycbwky1zdTmBQVPUGk5Nby-I99NWnzHalxIY5CtLU_sMNfZEaXQHrl1mkMaCeIxOHAVyE/exec";

    $.getJSON(kr_aircraft_info_api_URL, function (response) {
        kr_fighterinfo_api = response["data"]["fighter"];
        fighter_output();
        kr_torpedoinfo_api = response["data"]["torpedo"];
        torpedo_output();
        kr_bomberinfo_api = response["data"]["bomber"];
        bomber_output();
        kr_scoutinfo_api = response["data"]["scout"];
        scout_output();
        //    $("#test").html(kr_torpedoinfo_api);
    });

}


function fighter_output() {
    let kr_fighterinfo_filter = [];
    let fighter_filter = [];

    for (i = 0; i < 5; i++) {
        if ($('#fighter_input' + [i + 1]).is(':checked')) {
            fighter_filter[i] = $('#fighter_input' + [i + 1]).val();
        }
    }

    for (i = 0; i < kr_fighterinfo_api.length; i++) {
        for (j = 0; j < 5; j++) {
            if (kr_fighterinfo_api[i][15] == fighter_filter[j]) {
                kr_fighterinfo_filter.push(kr_fighterinfo_api[i]);
            }
        }
    }

    $('#fighter_output').DataTable({
        data: kr_fighterinfo_filter,
        order: [[4, "desc"]],
        retrieve: true,
        paging: false,
        searching: false,
        info: false,
        columns: [
            { title: "국가" },
            { title: "함재기명" },
            { title: "용적" },
            { title: "무게" },
            { title: "레벨" },
            { title: "병종" },
            { title: "능력" },
            { title: "DP" },
            { title: "AP방어" },
            { title: "HE방어" },
            { title: "최대속도" },
            { title: "연료량" },
            { title: "시야" },
            { title: "공격력" },
            { title: "준비시간" },
            { title: "차수" },
        ],
        columnDefs: [
            { targets: 5, visible: false },
            { targets: 6, visible: false },
            { targets: 9, visible: false },
        ]
    });
}

function torpedo_output() {
    let kr_torpedoinfo_filter = [];
    let torpedo_filter = [];

    for (i = 0; i < 3; i++) {
        if ($('#torpedo_input' + [i + 1]).is(':checked')) {
            torpedo_filter[i] = $('#torpedo_input' + [i + 1]).val();
        }
    }

    for (i = 0; i < kr_torpedoinfo_api.length; i++) {
        for (j = 0; j < 3; j++) {
            if (kr_torpedoinfo_api[i][15] == torpedo_filter[j]) {
                kr_torpedoinfo_filter.push(kr_torpedoinfo_api[i]);
            }
        }
    }

    $('#torpedo_output').DataTable({
        data: kr_torpedoinfo_filter,
        order: [[4, "desc"]],
        retrieve: true,
        paging: false,
        searching: false,
        info: false,
        columns: [
            { title: "국가" },
            { title: "함재기명" },
            { title: "용적" },
            { title: "무게" },
            { title: "레벨" },
            { title: "병종" },
            { title: "능력" },
            { title: "DP" },
            { title: "AP방어" },
            { title: "HE방어" },
            { title: "최대속도" },
            { title: "연료량" },
            { title: "시야" },
            { title: "공격력" },
            { title: "준비시간" },
            { title: "차수" },
            { title: "어뢰데미지" },
            { title: "어뢰속도" },
        ],
        columnDefs: [
            { targets: 5, visible: false },
            { targets: 6, visible: false },
            { targets: 9, visible: false },
        ]
    });
}

function bomber_output() {
    let kr_bomberinfo_filter = [];
    let bomber_filter = [];

    for (i = 0; i < 4; i++) {
        if ($('#bomber_input' + [i + 1]).is(':checked')) {
            bomber_filter[i] = $('#bomber_input' + [i + 1]).val();
        }
    }

    for (i = 0; i < kr_bomberinfo_api.length; i++) {
        for (j = 0; j < 4; j++) {
            if (kr_bomberinfo_api[i][15] == bomber_filter[j]) {
                kr_bomberinfo_filter.push(kr_bomberinfo_api[i]);
            }
        }
    }

    $('#bomber_output').DataTable({
        data: kr_bomberinfo_filter,
        order: [[4, "desc"]],
        retrieve: true,
        paging: false,
        searching: false,
        info: false,
        columns: [
            { title: "국가" },
            { title: "함재기명" },
            { title: "용적" },
            { title: "무게" },
            { title: "레벨" },
            { title: "병종" },
            { title: "능력" },
            { title: "DP" },
            { title: "AP방어" },
            { title: "HE방어" },
            { title: "최대속도" },
            { title: "연료량" },
            { title: "시야" },
            { title: "공격력" },
            { title: "준비시간" },
            { title: "차수" },
            { title: "HE데미지" },
        ],
        columnDefs: [
            { targets: 5, visible: false },
            { targets: 6, visible: false },
            { targets: 9, visible: false },
        ]
    });
}

function scout_output() {
    let kr_scoutinfo_filter = [];
    let scout_filter = [];

    for (i = 0; i < 5; i++) {
        if ($('#scout_input' + [i + 1]).is(':checked')) {
            scout_filter[i] = $('#scout_input' + [i + 1]).val();
        }
    }

    for (i = 0; i < kr_scoutinfo_api.length; i++) {
        for (j = 0; j < 5; j++) {
            if (kr_scoutinfo_api[i][15] == scout_filter[j]) {
                kr_scoutinfo_filter.push(kr_scoutinfo_api[i]);
            }
        }
    }

    $('#scout_output').DataTable({
        data: kr_scoutinfo_filter,
        order: [[4, "desc"]],
        retrieve: true,
        paging: false,
        searching: false,
        info: false,
        columns: [
            { title: "국가" },
            { title: "함재기명" },
            { title: "용적" },
            { title: "무게" },
            { title: "레벨" },
            { title: "병종" },
            { title: "능력" },
            { title: "DP" },
            { title: "AP방어" },
            { title: "HE방어" },
            { title: "최대속도" },
            { title: "연료량" },
            { title: "시야" },
            { title: "공격력" },
            { title: "준비시간" },
            { title: "차수" },
        ],
        columnDefs: [
            { targets: 5, visible: false },
            { targets: 6, visible: false },
            { targets: 9, visible: false },
        ]
    });
}