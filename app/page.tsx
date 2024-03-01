"use client";

import Meal from "@/components/MealDisplay";
import { api } from "@/convex/_generated/api";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Id } from "@/convex/_generated/dataModel";
dayjs.extend(timezone);
dayjs.extend(utc);

export default function Home() {
  const [datetime, setDatetime] = useState(dayjs().startOf("day").valueOf());
  const newMeal = useMutation(api.meals.newMeal);
  const meals = useQuery(api.meals.getMealsForDate, {
    datetime: datetime.valueOf(),
    timezoneOffset: new Date().getTimezoneOffset(),
  });
  // whether a meal should have its late editor open upon rendering
  const [openLateEditorMealId, setOpenLateEditorMealId] = useState<
    undefined | Id<"meals">
  >(undefined);

  useEffect(() => {
    // reset this state when switching to a different day
    setOpenLateEditorMealId(undefined);
  }, [datetime]);

  const handleNewMenu = async (openLateEditor = false) => {
    // hard code to dinner
    const newMealId = await newMeal({
      meal: {
        datetime: dayjs(datetime)
          .startOf("day")
          .hour(19)
          .minute(22)
          .utc()
          .valueOf(),
        name: "Dinner",
      },
    });
    if (openLateEditor) {
      // open the late editor for the new meal right away
      setOpenLateEditorMealId(newMealId);
    }
  };

  return (
    <Box
      bgcolor={(theme) => theme.vars.palette.background.level1}
      minHeight="100vh"
    >
      <Box
        mr="auto"
        py={1}
        px={2}
        sx={(theme) => ({ bgcolor: theme.vars.palette.background.surface })}
      >
        <Typography fontWeight="bold" textTransform="uppercase">
          tΞp lates
        </Typography>
      </Box>

      <Stack py={4} px={2} gap={4} maxWidth="65ch" m="auto">
        <Stack direction="row" gap={1}>
          <Typography level="h1" fontWeight="200" lineHeight="1">
            {datetime === dayjs().startOf("day").valueOf()
              ? "Today"
              : dayjs(datetime).format("dddd, MMMM D, YYYY")}
          </Typography>
          <Box ml="auto">
            <ButtonGroup>
              <IconButton
                onClick={() =>
                  setDatetime((prevVal) =>
                    dayjs(prevVal).subtract(1, "day").valueOf()
                  )
                }
              >
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={() =>
                  setDatetime((prevVal) =>
                    dayjs(prevVal).add(1, "day").valueOf()
                  )
                }
              >
                <NavigateNext />
              </IconButton>
            </ButtonGroup>
          </Box>
        </Stack>
        <Divider />
        {meals?.length === 0 && (
          <Button onClick={() => handleNewMenu()}>New menu</Button>
        )}
        {meals?.length === 0 && (
          <Button onClick={() => handleNewMenu(true)}>
            Request dinner late
          </Button>
        )}
        {meals?.map((meal, i) => (
          <Stack key={i}>
            <Meal
              meal={meal}
              openLateEditor={meal._id === openLateEditorMealId}
            />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
