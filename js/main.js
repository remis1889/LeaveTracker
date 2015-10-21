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
          gui.Window.open('add_emp.html', {
          	position: 'center',
          	width: 640,
          	height: 480,
          	focus: true
          });
     }
  })
);

firstMenuItem.submenu.append(new gui.MenuItem({
	label:'Schedule Leave', 
	click : function () {
          gui.Window.open('schedule.html', {
          	position: 'center',
          	width: 640,
          	height: 480,
          	focus: true
          });
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
          gui.Window.open('view_emp.html', {
          	position: 'center',
          	width: 640,
          	height: 480,
          	focus: true
          });
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

