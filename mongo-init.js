// MongoDB initialization script
// This script runs automatically when the container starts for the first time

db = db.getSiblingDB('okteto');

// Create the okteto user with readWrite permissions on the okteto database
try {
  db.createUser({
    user: 'okteto',
    pwd: 'mongodb123',
    roles: [
      {
        role: 'readWrite',
        db: 'okteto'
      }
    ]
  });
  print('User "okteto" created successfully');
} catch (error) {
  if (error.code === 51003) {
    print('User "okteto" already exists');
  } else {
    print('Error creating user:', error);
  }
}