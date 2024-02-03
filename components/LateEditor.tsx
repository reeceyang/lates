import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cancel, Save } from "@mui/icons-material";
import {
  Button,
  Card,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Sheet,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useQuery } from "convex/react";
import { useState } from "react";
import DishDisplay from "./DishDisplay";
import { Late, ServingMethod } from "@/convex/lates";
import dayjs from "dayjs";
import { WithoutSystemFields } from "convex/server";

export interface LateEditorProps {
  mealId: Id<"meals">;
  onSave: (late: WithoutSystemFields<Late>) => void;
  open: boolean;
  onClose: () => void;
  late: Partial<WithoutSystemFields<Late>>;
}

const NAME_KEY = "lateName";
const DESCRIPTION_KEY = "lateDescription";

/**
 * Component for editing or creating lates. The parent component controls what
 * happens with the edited late fields through the `onSave` callback. Previous
 * late field values are first filled in from the `late` prop, and then from
 * browser localStorage.
 */
const LateEditor = ({
  mealId,
  onSave,
  open,
  onClose,
  late,
}: LateEditorProps) => {
  const meal = useQuery(api.meals.get, { mealId });
  const allDishes = useQuery(api.dishes.getDishesForMeal, { mealId });
  const [name, setName] = useState(
    late.name ?? localStorage.getItem(NAME_KEY) ?? ""
  );
  const [servingMethod, setServingMethod] = useState(
    late.servingMethod ?? ServingMethod.FRIDGE
  );
  const [selectedDishIds, setSelectedDishIds] = useState<Id<"dishes">[]>(
    late.dishIds ?? []
  );
  const allSelected = allDishes?.length === selectedDishIds.length;
  const [description, setDescription] = useState(
    late.description ?? localStorage.getItem(DESCRIPTION_KEY) ?? ""
  );
  const [isEmptyNameError, setIsEmptyNameError] = useState(false);

  const handleSave = () => {
    if (name !== "") {
      onSave({
        name,
        servingMethod,
        mealId,
        dishIds: selectedDishIds,
        description,
      });
      localStorage.setItem(NAME_KEY, name);
      localStorage.setItem(DESCRIPTION_KEY, description);
      onClose();
    } else {
      setIsEmptyNameError(true);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      anchor="right"
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            p: { md: 3, sm: 0 },
            boxShadow: "none",
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        <DialogTitle>
          {Object.keys(late).length > 0 ? "Editing" : "Requesting"} a{" "}
          {meal?.name} late for{" "}
          {dayjs(meal?.datetime).format("dddd, MMMM D, YYYY")}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ overflowX: "clip" }}>
          <Stack gap={4}>
            <FormControl error={isEmptyNameError}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (event.target.value) {
                    setIsEmptyNameError(false);
                  }
                }}
              />
              {isEmptyNameError && (
                <FormHelperText>name cannot be empty</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Serving method</FormLabel>
              <RadioGroup
                overlay
                name="member"
                defaultValue="person1"
                orientation="horizontal"
                sx={{ gap: 1 }}
                value={servingMethod}
                onChange={(event) =>
                  setServingMethod(event.target.value as ServingMethod)
                }
              >
                {Object.values(ServingMethod).map((servingMethod, i) => (
                  <Card component="label" key={i} variant="outlined" size="sm">
                    <Stack direction="row" gap={2}>
                      <Radio
                        value={servingMethod}
                        variant="soft"
                        sx={{ m: "auto" }}
                      />
                      <Typography>{servingMethod}</Typography>
                    </Stack>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>

            <Stack gap={2}>
              <FormLabel>Dishes</FormLabel>
              {allDishes && allDishes.length > 0 ? (
                <Card
                  variant="soft"
                  sx={{ width: "fit-content", px: 2 }}
                  size="sm"
                >
                  <Checkbox
                    label={allSelected ? "uncheck all" : "check all"}
                    overlay
                    onChange={() => {
                      if (allSelected) {
                        setSelectedDishIds([]);
                      } else if (allDishes) {
                        setSelectedDishIds(allDishes?.map((dish) => dish._id));
                      }
                    }}
                    checked={allSelected}
                  />
                </Card>
              ) : (
                <Typography>
                  There are no dishes for this meal yet. Please indicate your
                  preferences using the <strong>Additional information</strong>{" "}
                  textbox.
                </Typography>
              )}
              {allDishes?.map((dish, i) => (
                <Card variant="soft" key={i}>
                  <Checkbox
                    label={<DishDisplay dish={dish} />}
                    overlay
                    checked={selectedDishIds.includes(dish._id)}
                    onChange={() => {
                      if (!selectedDishIds.includes(dish._id)) {
                        setSelectedDishIds((prevVal) => [dish._id, ...prevVal]);
                      } else {
                        setSelectedDishIds((prevVal) =>
                          prevVal.filter((dishId) => dishId !== dish._id)
                        );
                      }
                    }}
                  />
                </Card>
              ))}
            </Stack>

            <FormControl>
              <FormLabel>Additional information</FormLabel>
              <Textarea
                placeholder="e.g. special instructions or preferences"
                minRows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormControl>
          </Stack>
        </DialogContent>

        <Divider />
        <DialogActions>
          <Stack direction="row" width="100%">
            <Button
              startDecorator={<Cancel />}
              sx={{ width: "fit-content", mr: "auto" }}
              onClick={onClose}
              color="neutral"
              variant="soft"
            >
              Cancel
            </Button>
            <Button
              startDecorator={<Save />}
              sx={{ width: "fit-content", ml: "auto" }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Sheet>
    </Drawer>
  );
};

export default LateEditor;
