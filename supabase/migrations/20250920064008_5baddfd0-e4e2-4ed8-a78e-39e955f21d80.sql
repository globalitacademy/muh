-- Add student role for user who doesn't have a role set
INSERT INTO user_roles (user_id, role) 
VALUES ('1d0b2d3b-87af-4ca0-8d94-ba8272c9266f', 'student')
ON CONFLICT (user_id, role) DO NOTHING;