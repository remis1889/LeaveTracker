var gui = require('nw.gui'),
currentWindow = gui.Window.get();

var windowMenu = new gui.Menu({ type: 'menubar' });

var firstMenuItem = new gui.MenuItem({
label:'Admin',
submenu: new gui.Menu()
});

windowMenu.append(firstMenuItem);

firstMenuItem.submenu.append(new gui.MenuItem({
	label:'New Employee', 
	click : function () {
          window.location.href = 'add_emp.html';
     }
  })
);

firstMenuItem.submenu.append(new gui.MenuItem({
	label:'Schedule Leave', 
	click : function () {
          window.location.href = 'schedule.html';
    	}
  })
);

firstMenuItem.submenu.append(new gui.MenuItem({	type:'separator'  }));

firstMenuItem.submenu.append(new gui.MenuItem({
	label:'Exit', 
	click : function () {
          currentWindow.close();
      }
  })
);
currentWindow.menu = windowMenu;


var secondMenuItem = new gui.MenuItem({
label:'View',
submenu: new gui.Menu()
});
windowMenu.append(secondMenuItem);
// Add submenu items
secondMenuItem.submenu.append(new gui.MenuItem({
	label:'View Employees', 
	click : function () {
          window.location.href = 'view_emp.html';
      }
  })
);

secondMenuItem.submenu.append(new gui.MenuItem({
  label:'View Schedule', 
  click : function () {
          window.location.href = 'index.html';
      }
  })
);

secondMenuItem.submenu.append(new gui.MenuItem({
	label:'Export Schedule', 
	click : function () {
          gui.Window.open('export.html', {
          	position: 'center',
          	width: 640,
          	height: 480,
          	focus: true
          });
      }
  })
);
currentWindow.menu = windowMenu;

var thirdMenuItem = new gui.MenuItem({
label:'Settings',
submenu: new gui.Menu()
});
windowMenu.append(thirdMenuItem);
// Add submenu items
thirdMenuItem.submenu.append(new gui.MenuItem({
  label:'Employee Category', 
  click : function () {
          window.location.href = '88.html';
      }
  })
);

thirdMenuItem.submenu.append(new gui.MenuItem({
  label:'Set Annual Leave', 
  click : function () {
          window.location.href = 'emp_leave.html';
      }
  })
);

thirdMenuItem.submenu.append(new gui.MenuItem({
  label:'Leave Status', 
  click : function () {
          gui.Window.open('set_status.html', {
            position: 'center',
            width: 640,
            height: 480,
            focus: true
          });
      }
  })
);
currentWindow.menu = windowMenu;

