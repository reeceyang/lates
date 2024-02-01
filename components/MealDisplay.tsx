import { api } from "@/convex/_generated/api";
import { TakeoutDining } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import DishEditor from "./DishEditor";
import { Dish } from "@/convex/dishes";
import DishDisplay from "./DishDisplay";
import { Meal } from "@/convex/meals";
import dayjs from "dayjs";
import LateEditor from "./LateEditor";
import LateDisplay from "./LateDisplay";
import { WithoutSystemFields } from "convex/server";

export interface MealProps {
  meal: Meal;
  editable?: boolean;
}

const MealDisplay = ({ meal, editable = false }: MealProps) => {
  const dishes = useQuery(api.dishes.getDishesForMeal, { mealId: meal._id });
  const lates = useQuery(api.lates.getLatesForMeal, { mealId: meal._id });
  const newDish = useMutation(api.dishes.newDish);
  const newLate = useMutation(api.lates.newLate);
  const [isLateEditorOpen, setIsLateEditorOpen] = useState(false);

  const handleNewDish = (dish: Omit<WithoutSystemFields<Dish>, "mealId">) => {
    newDish({ dish: { ...dish, mealId: meal._id } });
  };

  return (
    <>
      <Stack gap={4}>
        <Stack direction="row" gap={1}>
          <Typography level="h2" mr="auto">
            {meal.name} @ {dayjs(meal.datetime).format("h:mm a")}
          </Typography>
          <Box>
            <Button
              startDecorator={<TakeoutDining />}
              sx={{ width: "max-content" }}
              onClick={() => setIsLateEditorOpen(true)}
            >
              Request late
            </Button>
          </Box>
        </Stack>

        <Divider />

        <Stack>
          <Typography level="h3">Menu</Typography>
          <List marker="disc" sx={{ pl: 0 }}>
            {dishes?.map((dish, i) => (
              <ListItem key={i} sx={{ pl: 0 }}>
                <DishDisplay dish={dish} isEditable />
              </ListItem>
            ))}
            <ListItem sx={{ pl: 0 }}>
              <Typography color="neutral" pb={1}>
                add a new dish
              </Typography>
              {editable && (
                <DishEditor onSave={handleNewDish} isNew dish={{}} />
              )}
            </ListItem>
          </List>
        </Stack>

        <Divider />

        <Stack>
          <Typography level="h3">Lates</Typography>
          <List marker="disc" sx={{ pl: 0 }}>
            {lates?.map((late, i) => (
              <ListItem key={i} sx={{ pl: 0 }}>
                <LateDisplay late={late} />
              </ListItem>
            ))}

            <ListItem sx={{ pl: 0 }}>
              <Button
                startDecorator={<TakeoutDining />}
                sx={{ width: "max-content", my: "auto" }}
                onClick={() => setIsLateEditorOpen(true)}
                variant="outlined"
              >
                Request late
              </Button>
            </ListItem>
          </List>
        </Stack>
      </Stack>
      <LateEditor
        meal={meal}
        open={isLateEditorOpen}
        onClose={() => setIsLateEditorOpen(false)}
        onSave={(late) => newLate({ late })}
      />
    </>
  );
};

export default MealDisplay;
