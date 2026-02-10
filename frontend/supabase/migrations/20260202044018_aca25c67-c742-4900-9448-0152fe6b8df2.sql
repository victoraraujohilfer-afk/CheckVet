-- Improve the handle_new_user function with input validation and error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  sanitized_name text;
BEGIN
  -- Validate and sanitize the full_name from metadata
  -- Only extract full_name, limit length to prevent abuse
  sanitized_name := LEFT(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), 255);
  
  -- Only set if not empty after sanitization
  IF sanitized_name = '' THEN
    sanitized_name := NULL;
  END IF;
  
  -- Insert profile with validated data
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, sanitized_name);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;