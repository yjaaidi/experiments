from enum import Enum
from ortools.sat.python import cp_model

class Locale(Enum):
  EN = 1
  EN_US = 2

def derive_boolean_variable(model, name, var, value):
  boolean = model.NewBoolVar(name)
  model.Add(var == value).OnlyEnforceIf(boolean)
  model.Add(var != value).OnlyEnforceIf(boolean.Not())
  return boolean

def main():
  model = cp_model.CpModel()

  audio = model.NewIntVar(1, len(Locale), 'audio')
  subtitles = model.NewIntVar(1, len(Locale), 'subtitles')
  missing_tracks = [
    derive_boolean_variable(model, "audio_en", audio, Locale.EN.value),
    derive_boolean_variable(model, "audio_en_us", audio, Locale.EN_US.value),
    derive_boolean_variable(model, "subtitles_en", subtitles, Locale.EN.value),
    derive_boolean_variable(model, "subtitles_en_us", subtitles, Locale.EN_US.value),
  ]

  model.Add(audio == subtitles)

  model.Maximize(audio)
  if len(missing_tracks) > 0:
    model.Minimize(sum(missing_tracks))
  
  solver = cp_model.CpSolver()
  status = solver.Solve(model)

  print(f"Status: {solver.StatusName()}")
  if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
      print(f"audio: {Locale(solver.Value(audio)).name}")
      print(f"subtitles: {Locale(solver.Value(subtitles)).name}")
      tracks_to_order = [missing_track.Name() for missing_track in missing_tracks if solver.Value(missing_track) == 1]
      print(f"tracks to order: {tracks_to_order}")

main()


