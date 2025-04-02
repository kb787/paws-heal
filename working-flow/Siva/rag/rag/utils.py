from Siva.rag.rag.settings import logger


class TimeConverter:
    @staticmethod
    def convert_ts(ts: str) -> int:
        """
        Converts various timestamp formats to total seconds with robust handling.

        Parameters
        ----------
        ts : str
            A time string that can be:
            - HH:MM:SS format
            - MM:SS format
            - Seconds as integer or float
            - Decimal string representing seconds

        Returns
        -------
        int
            Total number of seconds
        """
        try:
            # Handle None or 'none' case
            if ts is None or str(ts).lower() == "none":
                return None

            # Convert to string to handle potential numeric inputs
            ts_str = str(ts).strip()

            # First, try handling float/decimal inputs
            try:
                # If it's a decimal string, convert to integer seconds
                if "." in ts_str:
                    return int(float(ts_str))
            except ValueError:
                pass

            # Handle time format strings
            try:
                # Split the time string
                time_parts = ts_str.split(":")
                time_parts = [int(part) for part in time_parts]

                # Convert to total seconds based on number of parts
                if len(time_parts) == 3:
                    return time_parts[0] * 3600 + time_parts[1] * 60 + time_parts[2]
                elif len(time_parts) == 2:
                    return time_parts[0] * 60 + time_parts[1]
                elif len(time_parts) == 1:
                    return time_parts[0]

            except ValueError:
                # If conversion fails, try direct integer/float conversion
                try:
                    return int(float(ts_str))
                except ValueError:
                    logger.error(f"Unable to convert timestamp: {ts}")
                    raise ValueError(f"Invalid timestamp format: {ts}")

        except Exception as e:
            logger.error(f"Comprehensive error converting timestamp '{ts}': {e}")
            raise ValueError(f"Error converting timestamp '{ts}': {e}")
