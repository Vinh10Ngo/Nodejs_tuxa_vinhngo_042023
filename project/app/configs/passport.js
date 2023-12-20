var md5 = require('md5');

const usersModel = require(__path__models + 'users')
var LocalStrategy = require('passport-local').Strategy;
const groupsModel = require(__path__models + 'groups')
const notifyConfigs = require(__path__configs + 'notify');

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
          try {
            await usersModel.getItemsByUserName(username, null).then((users) => {
              let user = users[0]
              if (user === undefined || users.length == 0) {
                return done(null, false, {message: notifyConfigs.ERROR_LOGIN});
              } else {
                if (md5(password) !== user.password) {
                  return done(null, false, {message: notifyConfigs.ERROR_LOGIN });
                } else {
                  console.log('dang nhap ok');
                  return done(null, user);
                }
              }
            })
          } catch (error) {
            return done(error);
          }
        }
      ));
    
      passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
      
      passport.deserializeUser(async (id, done) => {
        try {
          await usersModel.getItems(id).then((user) => {
            if (user) {
              const groupsID = user.groups.id
              // Giả sử info là đối tượng ban đầu
              const info = {
                name: 'John Doe',
                age: 30,
                email: 'john@example.com',
                address: '123 Street, City',
                // ... các trường khác
              };

              // Tạo đối tượng mới từ info chỉ chứa các trường mong muốn
              const newInfo = {
                name: info.name,
                email: info.email,
                // Thêm các trường khác nếu cần thiết
              };

              
              groupsModel.getItems(groupsID).then((groupsInfo) => {
                if (groupsInfo) {
                  user.groups = groupsInfo 
                }
                done(null, user)   
              })
            } else {
            done(null, user);
            }
          })     
        } catch (error) {
          done(error);
        }
      });
}