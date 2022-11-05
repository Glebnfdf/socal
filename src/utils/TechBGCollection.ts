import { iTechnician } from "../components/Gant/TechnicianListModel/TechnicianListModel";

interface iTechListBG {
  id: number,
  bgColor: string
}

export default class TechBGCollection {
  private static instance: TechBGCollection;
  private readonly BGCollection: string[];
  private readonly techList: iTechListBG[];

  private constructor() {
    this.BGCollection = ["37dca1", "9747ff", "ffb737", "37dcd2", "da47ff", "ff5b37", "37c8dc", "476fff", "ff9737", "4eb7fd", "892cff", "48eafe"];
    this.techList = [];
  }

  static getInstance() {
    if (!TechBGCollection.instance) {
      TechBGCollection.instance = new TechBGCollection();
    }
    return TechBGCollection.instance;
  }

  public addTechnicians(newTechList: iTechnician[]): void {
    newTechList.forEach((newTechnician: iTechnician): void => {
      let isNewTechnician: boolean = true;
      this.techList.forEach((technician: iTechListBG): void => {
        if (technician.id === newTechnician.id) {
          isNewTechnician = false;
        }
      });
      if (isNewTechnician) {
        this.techList.push({
          id:newTechnician.id,
          bgColor: this.getRandomBGColor()
        });
      }
    });
  }

  public getBGColor(techId: number): string {
    for (let i = 0; i < this.techList.length; i++) {
      if (this.techList[i].id === techId) {
        return this.techList[i].bgColor;
      }
    }
    return this.BGCollection[0];
  }

  private getRandomBGColor(): string {
    const randomIndex: number = Math.floor(Math.random() * 12);
    return this.BGCollection[randomIndex];
  }
}
