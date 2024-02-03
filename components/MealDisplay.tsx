import { api } from "@/convex/_generated/api";
import { TakeoutDining } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
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
import { WithoutSystemFields } from "convex/server";
import LateDisplay from "./LateDisplay";

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

        <Stack>
          <List
            sx={{
              "--List-gap": "2rem",
              "--ListItem-paddingX": 0,
            }}
          >
            {dishes?.map((dish, i) => (
              <ListItem key={i}>
                <DishDisplay dish={dish} isEditable showDots />
              </ListItem>
            ))}
            <ListItem>
              <Card sx={{ width: "100%" }}>
                {editable && (
                  <DishEditor onSave={handleNewDish} isNew dish={{}} />
                )}
              </Card>
            </ListItem>
          </List>
        </Stack>

        <Divider />

        <Stack gap={2}>
          <Stack direction="row" flexWrap="wrap">
            <Typography level="h3">Lates</Typography>
            <Box ml="auto">
              <Button
                startDecorator={<TakeoutDining />}
                sx={{ width: "max-content", my: "auto" }}
                onClick={() => setIsLateEditorOpen(true)}
                variant="outlined"
              >
                Request late
              </Button>
            </Box>
          </Stack>
          {lates?.map((late, i) => (
            <Card
              key={i}
              {...(late.cancelled && {
                sx: (theme) => ({
                  background: theme.vars.palette.neutral[100],
                }),
              })}
            >
              <LateDisplay late={late} />
            </Card>
          ))}
        </Stack>
      </Stack>
      <LateEditor
        mealId={meal._id}
        open={isLateEditorOpen}
        onClose={() => setIsLateEditorOpen(false)}
        onSave={(late) => newLate({ late })}
        late={{}}
      />
    </>
  );
};

export default MealDisplay;
