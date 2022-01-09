import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, PrimeNGConfig } from "primeng/api";
import { initJsStore } from "./service/db.service";
import { SyncService } from "./service/sync.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: "Labels",
      command: (event: any) => {
        console.log(event)
        this.router.navigate(["/", "label"]);
      }
    },
    {
      label: "ToDos",
      command: (event: any) => {
        console.log(event)
        this.router.navigate(["/", "todo"]);
      }
    },
    {
      label: "Sync All",
      command: (event: any) => {
        console.log(event);

        this.syncService.sync()
          .subscribe(
            {
              next: value => console.log(value),
              error: err => { console.log(err) },
              complete: () => console.log("done!")
            }
          );
      }
    }
  ];

  constructor(private router: Router,
    private primengConfig: PrimeNGConfig,
    private syncService: SyncService) { }

  async ngOnInit() {
    try {
      this.primengConfig.ripple = true;

      await initJsStore();
      console.log("jsstore connected");
    } catch (error: any) {
      alert(error.message);
    }
  }
}
