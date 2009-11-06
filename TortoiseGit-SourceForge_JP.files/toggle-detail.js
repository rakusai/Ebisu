/*
 *
 * SF.JP toggle extra description by javasript
 *
 */

function toggle_element(elem, switcher) {
	if (typeof(elem) == "string")
		elem = document.getElementById(elem);
	if (!elem) { return false; }

	var cur = elem.style.display != 'none';
	elem.style.display = cur ? 'none' : '';

	if (typeof(switcher) == "string")
		switcher = document.getElementById(switcher);
	if (switcher) {
		switcher.className = switcher.className.replace(new RegExp('-' + (cur ? 'show' : 'hide') + '(?:$|\\s)'), cur ? '-hide' : '-show');
	}

}

function toggle_extra_desc(id, switcher) {
	toggle_element('extra-desc-'+id, switcher)
}

function toggle_releases(pkgid) {
	var switcher = document.getElementById('releases-toggle-switch-'+pkgid);
	var flag = switcher.getAttribute('sfjp:hideRels') == 0;
	var children = switcher.getAttribute('sfjp:switchChildren').split(/\s+/);
	var e;
	for (var i = 0; i < children.length; i++) {
		if (!children[i]) continue;
		e = document.getElementById(children[i]);
		if (!e) continue;
		cur = e.style.display = flag ? '' : 'none';
	}
	switcher.setAttribute('sfjp:hideRels', flag ? 1 : 0);
	switcher.className = 'releases-toggle-switch-' + (flag ? 'show' : 'hide');
}

function set_all_element(flag, element_class, switcher_class_base, base) {
	if (!element_class) { return false; }
	var i;
	var elements;
	var base;
	var cn;
	var el_class_re = new RegExp('(?:^|\\s)'+element_class+'(?:$|\\s)');
	var sw_class_re;

	if (typeof(base) == "string") {
		base = document.getElementById(base);
	} else {
		base = base;
	}
	if (!base) { base = document.getElementById('main-content') || document; }

	elements = base.getElementsByTagName('*');

	if (switcher_class_base) {
		sw_class_re = new RegExp('(^|\\s)(' + switcher_class_base
					+ (switcher_class_base.slice(-1) == "-" ? '' : '-')
					+ ')' + (flag ? 'hide' : 'show') + '(?=($|\\s))');
	}

	for (i = 0; i < elements.length; i++) {
		cn = elements[i].className;
		if (!cn) { continue; }
		if (cn.match(el_class_re)) {
			elements[i].style.display = flag ? '' : 'none';
		} else if (switcher_class_base && cn.indexOf(switcher_class_base) > -1) {
			elements[i].className = cn.replace(sw_class_re, "$1$2" + (flag ? 'show' : 'hide'));
		} else {
			continue;
		}
	}
}

function set_all_extra_desc(flag) {
	set_all_element(flag, 'extra-desc', 'extra-desc-switch-');
}

function toggle_all_extra_desc(elem, show_label, hide_label) {
	var label;

	var cur = (elem.className == 'extra-desc-switch-all-hide');

	if (cur) {
		elem.className = 'extra-desc-switch-all';
		elem.innerHTML = show_label;
		set_all_extra_desc(false);
	} else {
		elem.className = 'extra-desc-switch-all-hide';
		elem.innerHTML = hide_label;
		set_all_extra_desc(true);
	}
}

function set_default_all_extra_desc(flag) {
	var elem = document.getElementById('extra-desc-switch-all');
	if (!elem) { return false; };

	elem.className = (flag ? 'extra-desc-switch-all-hide' : 'extra-desc-switch-all');
	set_all_extra_desc(flag);
}

function show_uline(elem) {
	elem.style.textDecoration = 'underline';
	elem.style.color = '#0066FF';
}

function hide_uline(elem) {
	elem.style.textDecoration = 'none';
	elem.style.color = '#003399';
}

function switch_forum_admin_boxes(switch_elm, edit_switch_title, delete_switch_title) {
	var ebox_obj = document.getElementById('forum_status_update_box');
	var dbox_obj = document.getElementById('forum_delete_boxes');
	toggle_element(ebox_obj);
	toggle_element(dbox_obj);

	var cur = (switch_elm.className == 'forum-delete-switch');

	if (cur) {
		switch_elm.className = 'forum-edit-switch';
		switch_elm.innerHTML = edit_switch_title;
	} else {
		switch_elm.className = 'forum-delete-switch';
		switch_elm.innerHTML = delete_switch_title;
	}
}

function toggle_forum_desc_deleted() {
	var desc_check = document.getElementById('show_desc').checked;
	var deleted_check = document.getElementById('show_deleted').checked;

	if (desc_check) {
		elements = document.getElementById('forum_list').getElementsByTagName('tr');

		for (i = 0; i < elements.length; i++) {
			cn = elements[i].className;
			if (!cn) { continue; }
			if (cn.match(new RegExp('deleted_list_forum_descriptions'))) {
				elements[i].style.display = deleted_check ? '' : 'none';
			}
		}
	} else {
		set_all_element(false, 'deleted_list_forum_descriptions');
	}
}
