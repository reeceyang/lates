import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Late } from "@/convex/lates";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormLabel,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery } from "convex/react";
import { WithoutSystemFields } from "convex/server";
import { useState } from "react";
import LateEditor from "./LateEditor";
import dayjs from "dayjs";

export interface LateDisplayProps {
  late: Late;
}

/**
 * Displays a late and controls for editing, cancelling, and fulfilling the late.
 */
const LateDisplay = ({ late }: LateDisplayProps) => {
  const allDishes = useQuery(api.dishes.getDishesForMeal, {
    mealId: late.mealId,
  });
  const setIsCancelled = useMutation(api.lates.setIsCancelled);
  const setIsFulfilled = useMutation(api.lates.setIsFulfilled);
  const patchLate = useMutation(api.lates.patch);
  const [isEditing, setIsEditing] = useState(false);

  const onlyIncludedDishes = late.dishIds
    .map((dishId) => allDishes?.find((dish) => dish._id === dishId))
    .filter((dish): dish is Dish => dish !== undefined);
  const excludedDishes = allDishes?.filter(
    (dish) => !late.dishIds.includes(dish._id)
  );
  const dishString = (() => {
    if (excludedDishes) {
      if (onlyIncludedDishes.length === 0) {
        return "No menu items selected";
      }
      if (excludedDishes.length === 0) {
        return "All menu items selected";
      }
      const lf = new Intl.ListFormat("en"); // joins strings together grammatically
      if (excludedDishes?.length > onlyIncludedDishes.length) {
        return `Only ${lf.format(onlyIncludedDishes.map((dish) => dish.name))}`;
      } else {
        return `Everything except for ${lf.format(
          excludedDishes.map((dish) => dish.name)
        )}`;
      }
    }
    return undefined;
  })();

  const toggleCancel = () => {
    setIsCancelled({
      lateId: late._id,
      cancelled: !late.cancelled,
    });
  };

  const toggleFulfill = () => {
    setIsFulfilled({
      lateId: late._id,
      fulfilled: !late.fulfilled,
    });
  };

  const handleSave = (updatedLate: WithoutSystemFields<Late>) => {
    patchLate({
      lateId: late._id,
      updatedLate: { ...updatedLate },
    });
    setIsEditing(false);
  };

  return (
    <>
      <Stack gap={1} flex="1">
        <Stack direction="row" gap={1}>
          <Typography fontWeight="bold" my="auto">
            {late.cancelled ? (
              <>
                CANCELLED <s>{late.name}</s>
              </>
            ) : (
              late.name
            )}
          </Typography>

          {!late.cancelled && (
            <Box m="auto">
              <Chip variant="outlined">{late.servingMethod}</Chip>
            </Box>
          )}
          <Box flex="1" />
          {!late.cancelled && (
            <Box m="auto">
              <Button
                size="sm"
                color="neutral"
                variant="outlined"
                onClick={toggleFulfill}
              >
                <Checkbox checked={late.fulfilled} size="sm" sx={{ mr: 1 }} />
                {late.fulfilled ? "fulfilled" : "fulfill"}
              </Button>
            </Box>
          )}
          {!late.cancelled && !late.fulfilled && (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              edit
            </Button>
          )}
          {!late.fulfilled && (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={toggleCancel}
            >
              {late.cancelled ? "uncancel" : "cancel"}
            </Button>
          )}
        </Stack>
        {!late.cancelled && (
          <>
            <Typography>
              {dishString ? dishString : <Skeleton>Lorem ipsum</Skeleton>}
            </Typography>
            <Typography sx={{ wordWrap: "break-word" }}>
              {late.description}
            </Typography>
            <Typography level="body-xs">
              Requested{" "}
              {dayjs(late._creationTime).format("MMM D, YYYY, hh:mm a ")}
            </Typography>
          </>
        )}
      </Stack>
      <LateEditor
        mealId={late.mealId}
        onSave={handleSave}
        open={isEditing}
        onClose={() => setIsEditing(false)}
        late={late}
      />
    </>
  );
};

export default LateDisplay;
