-- Create trigger to handle new user applications
CREATE TRIGGER trigger_new_user_application
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_application();